export type EstadoSolicitud = 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA' | 'CANCELADA';

export interface Recurso {
  id: number;
  nombre: string;
  tipo: string;
  disponible: boolean;
}

export interface Solicitud {
  id: number;
  docenteNombre: string;
  docenteDni: string;
  recurso: Recurso;
  fecha: string;
  moduloHorario: number;
  estado: EstadoSolicitud;
  motivoRechazo?: string;
  fechaActualizacion?: string;
}

export interface DisponibilidadModulo {
  moduloHorario: number;
  estado: 'LIBRE' | 'PENDIENTE' | 'CONFIRMADA';
}

export interface RecursoDisponibilidadResponse {
  recursoId: number;
  fecha: string;
  disponibilidad: DisponibilidadModulo[];
}