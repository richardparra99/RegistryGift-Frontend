import { apiClient } from "./interceptors";
import type { User } from "../models/User";

export class AuthService {
    static async login(
        username: string,
        password: string
    ): Promise<{ access: string; refresh: string; user: User }> {
        try {
            const response = await apiClient.post("token/", {
                username,
                password,
            });

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            const userResponse = await this.me();

            localStorage.setItem("user", JSON.stringify(userResponse));

            return { ...response.data, user: userResponse };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("Error al iniciar sesión: " + error.message);
            }
            throw new Error("Error al iniciar sesión: An unknown error occurred");
        }
    }

    static logout(): void {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    }

    static async register(
        username: string,
        email: string,
        password: string
    ): Promise<{ error?: string; message?: string }> {
        try {
            const response = await apiClient.post("auth/register/", {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("Error al registrar usuario: " + error.message);
            }
            throw new Error("Error al registrar usuario: An unknown error occurred");
        }
    }

    static async me(): Promise<User> {
        try {
            const response = await apiClient.get<User>("auth/me/");
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("Error al obtener usuario: " + error.message);
            }
            throw new Error("Error al obtener usuario: Se produjo un error desconocido");
        }
    }
}
