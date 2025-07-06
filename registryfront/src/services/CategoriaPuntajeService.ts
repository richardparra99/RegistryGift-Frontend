import axios from "axios";
import { CategoriaPuntaje } from "../models/CategoriaPuntaje";
import { UsuarioPuntaje } from "../models/UsuarioPuntaje";
import apiClient from "./interceptors";

export class CategoriaPuntajeService {
  private baseUrl = "http://localhost:3000/webproxy/categoria_puntaje/";

  async getCategorias(): Promise<CategoriaPuntaje[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getCategoriaById(id: number): Promise<CategoriaPuntaje> {
    const url = `${this.baseUrl}${id}/`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  }

  async getCategoriaPorPuntaje(puntos: number): Promise<CategoriaPuntaje> {
    const url = `${this.baseUrl}por-puntaje/?puntos=${puntos}`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  }

  async createCategoria(data: {
    nombre: string;
    min_puntos: number;
    max_puntos: number;
  }): Promise<CategoriaPuntaje> {
    const response = await axios.post(this.baseUrl, data, {
      withCredentials: true,
    });
    return response.data;
  }

  async updateCategoria(
    id: number,
    data: { nombre: string; min_puntos: number; max_puntos: number }
  ): Promise<CategoriaPuntaje> {
    const url = `${this.baseUrl}${id}/`;
    const response = await axios.put(url, data, { withCredentials: true });
    return response.data;
  }

  async deleteCategoria(id: number): Promise<void> {
    const url = `${this.baseUrl}${id}/`;
    await axios.delete(url, { withCredentials: true });
  }
  getUsuariosByCategoria(id: number): Promise<UsuarioPuntaje[]> {
  return apiClient.get(`/categoria-puntaje/${id}/usuarios/`)
    .then(response => response.data)
    .catch(error => {
      throw new Error("Error al obtener usuarios por categoría: " + error.message);
    });
}

}
