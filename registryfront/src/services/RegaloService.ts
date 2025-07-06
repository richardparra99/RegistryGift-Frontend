import axios from "axios";
import { Regalo } from "../models/Regalo";

export class RegaloService {
  private baseUrl = "http://localhost:3000/webproxy/regalos/";

  async getRegalos(): Promise<Regalo[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getRegalo(id: number): Promise<Regalo> {
    const response = await axios.get(`${this.baseUrl}${id}/`, { withCredentials: true });
    return response.data;
  }

  async createRegalo(data: Partial<Regalo>): Promise<Regalo> {
    const response = await axios.post(this.baseUrl, data, { withCredentials: true });
    return response.data;
  }

  async updateRegalo(id: number, data: Partial<Regalo>): Promise<Regalo> {
    const response = await axios.patch(`${this.baseUrl}${id}/`, data, { withCredentials: true });
    return response.data;
  }

  async deleteRegalo(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}${id}/`, { withCredentials: true });
  }

  async reservarRegalo(id: number): Promise<void> {
    await axios.post(`${this.baseUrl}${id}/reservar/`, {}, { withCredentials: true });
  }

  async cancelarReserva(id: number): Promise<void> {
    await axios.post(`${this.baseUrl}${id}/cancelar_reserva/`, {}, { withCredentials: true });
  }

  async getRegalosPorEvento(eventoId: number): Promise<Regalo[]> {
  const response = await axios.get(`${this.baseUrl}?evento=${eventoId}`, {
    withCredentials: true,
  });
  return response.data;
}

}
