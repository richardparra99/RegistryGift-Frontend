import { Libro } from "./Libro";

export interface Compra {
  id: number;
  total: string;
  confirmada: boolean;
  fecha: string;
  libros: Libro[];
  imagen_pago: string;
}