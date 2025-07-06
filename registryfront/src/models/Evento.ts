export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: 'CUMPLEAÑOS' | 'BODA' | 'BABY_SHOWER' | 'NAVIDAD' | 'OTRO';
  creado_por: string; 
}
