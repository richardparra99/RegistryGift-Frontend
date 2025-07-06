import axios from "axios";

export interface PuntajeResponse {
  usuario: string;
  puntos: number;
  categoria: string;
  min_puntos: number;
  max_puntos: number;
}


export class PuntajeService {
  private baseUrl = "http://localhost:3000/webproxy/puntaje/";

  async getMiPuntaje(): Promise<PuntajeResponse> {
    const response = await axios.get(this.baseUrl + "mio/", { withCredentials: true });
    return response.data;
  }

  async getRanking(): Promise<PuntajeResponse[]> {
    const response = await axios.get(this.baseUrl + "ranking/", { withCredentials: true });
    return response.data;
  }
}
