import { User } from "./User";
import { Evento } from "./Evento";

export interface Regalo {
  id: number;
  nombre: string;
  descripcion: string;
  url: string;
  cantidad_deseada: number;
  prioridad: "ALTA" | "MEDIA" | "BAJA" | "";
  reservado: boolean;
  reservado_por: User | null;
  evento: number | Evento;
  creado_en: string;
}
