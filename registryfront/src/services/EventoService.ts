import axios from "axios";
import { Evento } from "../models/Evento";

export class EventoService {
  private baseUrl = "http://localhost:3000/webproxy/eventos/";

  async getEventos(): Promise<Evento[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getEvento(id: number): Promise<Evento> {
    const response = await axios.get(`${this.baseUrl}${id}/`, {
      withCredentials: true,
    });
    return response.data;
  }

  async getMisEventos(): Promise<Evento[]> {
    const response = await axios.get(`${this.baseUrl}mis-eventos/`, {
      withCredentials: true,
    });
    return response.data;
  }

  async createEvento(data: {
    nombre: string;
    descripcion?: string;
    fecha: string;
    tipo: string;
  }): Promise<Evento> {
    const response = await axios.post(this.baseUrl, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }

  async updateEvento(
    id: number,
    data: {
      nombre?: string;
      descripcion?: string;
      fecha?: string;
      tipo?: string;
    }
  ): Promise<Evento> {
    const response = await axios.patch(`${this.baseUrl}${id}/`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }

  async deleteEvento(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}${id}/`, { withCredentials: true });
  }
}
