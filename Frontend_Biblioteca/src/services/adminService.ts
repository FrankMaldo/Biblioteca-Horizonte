import type { Solicitud, EstadoSolicitud } from '../types/solicitud';

const API_BASE_URL = 'http://localhost:8080/api';

export const adminService = {
  // HU-08: Panel Administrativo con Filtros Dinámicos
  obtenerSolicitudes: async (estado?: EstadoSolicitud | '', fecha?: string, docente?: string): Promise<Solicitud[]> => {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (fecha) params.append('fecha', fecha);
    if (docente) params.append('docente', docente);

    const response = await fetch(`${API_BASE_URL}/admin/solicitudes?${params.toString()}`);
    if (!response.ok) throw new Error('Error al obtener solicitudes');
    return response.json();
  },

  // HU-02: Confirmar Solicitud
  confirmarSolicitud: async (id: number): Promise<Solicitud> => {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${id}/confirmar`, {
      method: 'PUT',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al confirmar la solicitud');
    }
    return response.json();
  },

  // HU-03: Rechazar Solicitud
  rechazarSolicitud: async (id: number, motivo: string): Promise<Solicitud> => {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${id}/rechazar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al rechazar la solicitud');
    }
    return response.json();
  },

  // HU-10: Histórico de Reservas
  obtenerHistorico: async (): Promise<Solicitud[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/historico`);
    if (!response.ok) throw new Error('Error al obtener el histórico');
    return response.json();
  }
};