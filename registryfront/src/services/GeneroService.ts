import axios from "axios";
import { Genero } from "../models/Genero";
import { Libro } from "../models/Libro";
import { GeneroResponse } from "../models/dto/GeneroResponse";
import apiClient from "./interceptors";

export class GeneroService {
  private baseUrl = "http://localhost:3000/webproxy/genero/";

  async getGeneros(): Promise<Genero[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }
    getGeneroById(generoId: string): Promise<GeneroResponse> {
        return new Promise<GeneroResponse>((resolve, reject) => {
            apiClient.get("generos/" + generoId + "/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género por ID: " + error.message));
                });
        });
    }

        getLibrosByGenero(generoId: string): Promise<Array<Libro>> {
        return new Promise<Array<Libro>>((resolve, reject) => {
            apiClient.get("generos/" + generoId + "/libros/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener los libros por género: " + error.message));
                });
        });
    }
  async getLibrosPorGenero(id: number): Promise<Libro[]> {
    const url = `${this.baseUrl}${id}/libros/`;
    const response = await axios.get(url, { withCredentials: true });

    return response.data.sort(
      (a: Libro, b: Libro) => b.ventas - a.ventas
    );
  }

  async createGenero(data: { nombre: string }): Promise<Genero> {
    const response = await axios.post(
      this.baseUrl,
      data,
      { withCredentials: true }
    );
    return response.data;
  }

  async updateGenero(id: number, data: { nombre: string }): Promise<Genero> {
    const url = `http://localhost:3000/webproxy/genero/${id}/`;
    const response = await axios.put(url, data, { withCredentials: true });
    return response.data;
  }

  async deleteGenero(id: number): Promise<void> {
    const url = `http://localhost:3000/webproxy/genero/${id}/`;
    await axios.delete(url, { withCredentials: true });
  }

}
