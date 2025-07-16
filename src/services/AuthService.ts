import { apiClient } from "./interceptors";
import type { User } from "../models/User";
import axios from "axios";

export class AuthService {
	// LOGIN
	static async login(
		username: string,
		password: string
	): Promise<{ access: string; refresh: string; user: User }> {
		try {
			const response = await apiClient.post("token/", {
				username,
				password,
			});

			const access = response.data.access;
			const refresh = response.data.refresh;

			// Guardar en localStorage
			localStorage.setItem("access_token", access);
			localStorage.setItem("refresh_token", refresh);

			const user = await this.me();
			localStorage.setItem("user", JSON.stringify(user));

			return { access, refresh, user };
		} catch (error: any) {
			// Si el error es de axios y tiene respuesta del servidor (como un 401), se lanza tal cual
			if (axios.isAxiosError(error) && error.response) {
				throw error; // ⬅ Esto permite que el componente maneje error.response.status === 401
			}

			// Otro tipo de error no manejado (sin response del backend)
			throw new Error("Error al iniciar sesión");
		}
	}

	// LOGOUT
	static logout(): void {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
	}

	// REGISTRO
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
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.data?.error) {
				throw new Error("Error al registrar usuario: " + error.response.data.error);
			}
			throw new Error("Error al registrar usuario");
		}
	}

	// OBTENER DATOS DEL USUARIO AUTENTICADO
	static async me(): Promise<User> {
		try {
			const response = await apiClient.get<User>("auth/me/");
			return response.data;
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response) {
				throw error;
			}
			throw new Error("Error al obtener datos del usuario");
		}
	}
}
