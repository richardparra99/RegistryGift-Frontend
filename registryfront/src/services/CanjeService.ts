import axios from "axios";
import { CanjeRealizado } from "../models/CanjeRealizado";

export class CanjeService {
  private baseUrl = "http://localhost:3000/webproxy/canje/";

  /**
   * Realiza el canje de un producto por su ID.
   */
  async canjearProducto(productoId: number): Promise<CanjeRealizado> {
    try {
      const response = await axios.post(
        this.baseUrl, // ← POST /canje/
        { producto_id: productoId },
        {
          withCredentials: true, // si usas cookies para sesión
          // Si usas JWT en lugar de cookies:
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          // },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const detail = error.response.data.detail || Object.values(error.response.data)[0];
        throw new Error(detail);
      }
      throw new Error("Error desconocido al canjear producto");
    }
  }
}
