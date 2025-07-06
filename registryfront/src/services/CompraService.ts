import axios from "axios";
import { Compra } from "../models/Compra";
import { CompraConfirmada } from "../models/DetalleCompra";

export class CompraService {
  private baseUrl = "http://localhost:3000/webproxy/compra/";

  async getCompras(): Promise<Compra[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getAllCompras(): Promise<Compra[]> {
    const response = await axios.get(`${this.baseUrl}todas-compras/`, { withCredentials: true });
    return response.data;
  }

  async confirmarCompraDesdeCarrito(): Promise<CompraConfirmada> {
    const response = await axios.post(
      `${this.baseUrl}crear-desde-carrito/`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
}

export type { Compra };

