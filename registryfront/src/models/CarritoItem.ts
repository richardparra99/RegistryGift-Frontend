import { Libro } from "./Libro";
import { Usuario } from "./User";

export interface CarritoItem {
    id: number;
    usuario:Usuario; 
    libro:Libro; 
    fecha: string;
}