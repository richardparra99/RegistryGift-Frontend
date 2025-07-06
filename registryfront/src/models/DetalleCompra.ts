export interface DetalleCompra{
  compra_id: number;
  total: number;
  libros: { titulo: string; precio: number }[];
  qr: string;
}