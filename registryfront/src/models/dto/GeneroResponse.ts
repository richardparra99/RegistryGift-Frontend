import { LibroResponse } from "./LibroResponse";

export interface GeneroResponse {
    id: string;
    libros: LibroResponse[];
    nombre: string;
}
