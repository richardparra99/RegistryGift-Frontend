import { User } from "../models/User";
import apiClient from "./interceptors";

export class UserService {
    getUsers(): Promise<Array<User>> {
        return new Promise<Array<User>>((resolve, reject) => {
        apiClient.get("usuarios/")
            .then((response) => {
            resolve(response.data);
            })
            .catch((error) => {
            reject(
                new Error("Error al obtener la lista de usuarios: " + error.message)
            );
            });
        });
    }
}