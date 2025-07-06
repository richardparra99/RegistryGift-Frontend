import axios from "axios";
import { ProductoCanjeable } from "../models/productoCanjeable";
//import apiClient from "./interceptors";

export class ProductoCanjeableService {
  private baseUrl = "http://localhost:3000/webproxy/producto_canjeable/";

  async getProductos(): Promise<ProductoCanjeable[]> {
    const response = await axios.get(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async getProductoById(id: number): Promise<ProductoCanjeable> {
    const url = `${this.baseUrl}${id}/`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  }

  async createProducto(data: {
    nombre: string;
    descripcion?: string;
    imagen?: File;
    puntos_requeridos: number;
    stock: number;
    activo: boolean;
  }): Promise<ProductoCanjeable> {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    if (data.descripcion) formData.append("descripcion", data.descripcion);
    if (data.imagen) formData.append("imagen", data.imagen);
    formData.append("puntos_requeridos", data.puntos_requeridos.toString());
    formData.append("stock", data.stock.toString());
    formData.append("activo", data.activo ? "true" : "false");

    const response = await axios.post(this.baseUrl, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async updateProducto(
    id: number,
    data: {
      nombre: string;
      descripcion?: string;
      imagen?: File | null;
      puntos_requeridos: number;
      stock: number;
      activo: boolean;
    }
  ): Promise<ProductoCanjeable> {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    if (data.descripcion) formData.append("descripcion", data.descripcion);
    if (data.imagen) formData.append("imagen", data.imagen);
    formData.append("puntos_requeridos", data.puntos_requeridos.toString());
    formData.append("stock", data.stock.toString());
    formData.append("activo", data.activo ? "true" : "false");

    const url = `${this.baseUrl}${id}/`;
    const response = await axios.put(url, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async deleteProducto(id: number): Promise<void> {
    const url = `${this.baseUrl}${id}/`;
    await axios.delete(url, { withCredentials: true });
  }
}
