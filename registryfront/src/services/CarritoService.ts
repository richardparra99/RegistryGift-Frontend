import axios from "axios";


export class CarritoService {
  private baseUrl = "http://localhost:3000/webproxy/carrito/";


  async agregarItem(libroId: number): Promise<any> {
    const response = await axios.post(
      this.baseUrl,
      { libro: libroId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  }

  async obtenerCarrito(): Promise<any[]> {
    const response = await axios.get(this.baseUrl, {
      withCredentials: true,
    });
    return response.data;
  }

  async eliminarItem(itemId: number): Promise<void> {
    await axios.delete(`${this.baseUrl}${itemId}/`, {
      withCredentials: true,
    });
  }
}