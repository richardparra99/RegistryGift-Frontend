export interface LibroRequest {
    id?: string;
    titulo: string;
    autor: string;
    isbn: string;
    precio: string;
    descripcion: string;
    foto: FileList;
    generos_id: string[];
}