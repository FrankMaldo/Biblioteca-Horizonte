import type { Solicitud, RecursoDisponibilidadResponse } from '../types/solicitud';

const API_URL = 'http://localhost:8080/api';

export const solicitudService = {
  // HU-04: Obtener mis solicitudes filtrando por DNI del docente
  async obtenerMisSolicitudes(docenteDni: string): Promise<Solicitud[]> {
    const response = await fetch(`${API_URL}/solicitudes/mis-solicitudes?docenteDni=${docenteDni}`);
    if (!response.ok) throw new Error('Error al obtener las solicitudes');
    return response.json();
  },

  // HU-07: Cancelar solicitud
  async cancelarSolicitud(id: number): Promise<Solicitud> {
    const response = await fetch(`${API_URL}/solicitudes/${id}/cancelar`, {
      method: 'PUT',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'No se pudo cancelar la solicitud');
    }
    return response.json();
  },

  // HU-06: Consultar disponibilidad de un recurso por fecha
  async consultarDisponibilidad(recursoId: number, fecha: string): Promise<RecursoDisponibilidadResponse> {
    const response = await fetch(`${API_URL}/recursos/${recursoId}/disponibilidad?fecha=${fecha}`);
    if (!response.ok) throw new Error('Error al consultar la disponibilidad');
    return response.json();
  }
};