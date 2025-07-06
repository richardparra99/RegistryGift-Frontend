import axios from "axios";
import { Libro } from "../models/Libro";

export class LibroService {
  private baseUrl = "http://localhost:3000/webproxy/libro/";

  async getTopLibros(): Promise<Libro[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data.sort((a: Libro, b: Libro) => b.ventas - a.ventas);
  }

  async getAllLibros(): Promise<Libro[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getLibrosByGenero(generoId: number): Promise<Libro[]> {
    const response = await axios.get(this.baseUrl, {
      params: { genero: generoId },
      withCredentials: true,
    });
    return response.data;
  }

  async getLibro(id: number): Promise<Libro> {
    const response = await axios.get(`${this.baseUrl}${id}/`, {
      withCredentials: true,
    });
    return response.data;
  }

  async createLibro(data: FormData): Promise<Libro> {
    const response = await axios.post(this.baseUrl, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async updateLibro(id: number, data: FormData): Promise<Libro> {
    const response = await axios.patch(`${this.baseUrl}${id}/`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async deleteLibro(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}${id}/`, {
      withCredentials: true,
    });
  }
}
