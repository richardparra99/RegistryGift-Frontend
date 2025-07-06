import { Genero } from "../Genero";

export interface LibroResponse {
    id: number;
    generos: Genero[];
    titulo: string;
    autor: string;
    isbn: string;
    precio: string;
    descripcion: string;
    foto: string;
}