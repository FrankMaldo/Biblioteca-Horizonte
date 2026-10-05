import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { Solicitud, EstadoSolicitud } from '../types/solicitud';
import { CheckCircle, XCircle, Filter, RotateCcw, Clock, History } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [pestana, setPestana] = useState<'pendientes' | 'historico'>('pendientes');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [historico, setHistorico] = useState<Solicitud[]>([]);
  
  // Filtros (HU-08)
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | ''>('');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [filtroDocente, setFiltroDocente] = useState<string>('');
  
  // Modales y Errores
  const [modalRechazoId, setModalRechazoId] = useState<number | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState<string>('');
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const cargarSolicitudes = async () => {
    try {
      setMensajeError(null);
      const data = await adminService.obtenerSolicitudes(filtroEstado, filtroFecha, filtroDocente);
      setSolicitudes(data);
    } catch (err: any) {
      setMensajeError(err.message);
    }
  };

  const cargarHistorico = async () => {
    try {
      setMensajeError(null);
      const data = await adminService.obtenerHistorico();
      setHistorico(data);
    } catch (err: any) {
      setMensajeError(err.message);
    }
  };

  useEffect(() => {
    if (pestana === 'pendientes') {
      cargarSolicitudes();
    } else {
      cargarHistorico();
    }
  }, [pestana, filtroEstado, filtroFecha, filtroDocente]);

  const handleLimpiarFiltros = () => {
    setFiltroEstado('');
    setFiltroFecha('');
    setFiltroDocente('');
  };

  const handleConfirmar = async (id: number) => {
    try {
      setMensajeError(null);
      await adminService.confirmarSolicitud(id);
      cargarSolicitudes();
    } catch (err: any) {
      setMensajeError(err.message);
    }
  };

  const handleConfirmarRechazo = async () => {
    if (modalRechazoId === null) return;
    try {
      setMensajeError(null);
      await adminService.rechazarSolicitud(modalRechazoId, motivoRechazo);
      setModalRechazoId(null);
      setMotivoRechazo('');
      cargarSolicitudes();
    } catch (err: any) {
      setMensajeError(err.message);
    }
  };

  const getBadgeColor = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'CONFIRMADA': return 'bg-green-100 text-green-800 border-green-300';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELADA': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración - Biblioteca Horizonte</h1>
        <p className="text-gray-600">Gestión de reservas y auditoría de solicitudes</p>
      </header>

      {mensajeError && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Error en la operación:</p>
          <p>{mensajeError}</p>
        </div>
      )}

      {/* Tabs de Navegación */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setPestana('pendientes')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
            pestana === 'pendientes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Solicitudes y Filtros (HU-08)
        </button>
        <button
          onClick={() => setPestana('historico')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
            pestana === 'historico'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <History className="w-4 h-4 mr-2" />
          Histórico / Auditoría (HU-10)
        </button>
      </div>

      {pestana === 'pendientes' && (
        <>
          {/* Barra de Filtros Dinámicos (HU-08) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-700">Filtros:</span>
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoSolicitud | '')}
              className="p-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="">Todos los Estados</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
              <option value="RECHAZADA">RECHAZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>

            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm bg-white"
            />

            <input
              type="text"
              placeholder="Buscar docente..."
              value={filtroDocente}
              onChange={(e) => setFiltroDocente(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm bg-white"
            />

            <button
              onClick={handleLimpiarFiltros}
              className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Limpiar Filtros
            </button>
          </div>

          {/* Tabla de Solicitudes */}
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-700 text-xs uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Docente</th>
                  <th className="p-4">Recurso</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Módulo</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No se encontraron solicitudes con los criterios de búsqueda.
                    </td>
                  </tr>
                ) : (
                  solicitudes.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-gray-600">#{s.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{s.docenteNombre}</div>
                        <div className="text-xs text-gray-500">DNI: {s.docenteDni}</div>
                      </td>
                      <td className="p-4">{s.recurso.nombre}</td>
                      <td className="p-4">{s.fecha}</td>
                      <td className="p-4 font-semibold">Módulo {s.moduloHorario}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(s.estado)}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {s.estado === 'PENDIENTE' ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleConfirmar(s.id)}
                              className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
                              title="Confirmar Solicitud (HU-02)"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Confirmar
                            </button>
                            <button
                              onClick={() => setModalRechazoId(s.id)}
                              className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium"
                              title="Rechazar Solicitud (HU-03)"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Procesada</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pestana === 'historico' && (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-xs uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Docente</th>
                <th className="p-4">Recurso</th>
                <th className="p-4">Fecha Uso</th>
                <th className="p-4">Módulo</th>
                <th className="p-4">Estado Final</th>
                <th className="p-4">Motivo / Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {historico.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No hay registros históricos de solicitudes finalizadas.
                  </td>
                </tr>
              ) : (
                historico.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-gray-600">#{h.id}</td>
                    <td className="p-4 font-medium text-gray-800">{h.docenteNombre}</td>
                    <td className="p-4">{h.recurso.nombre}</td>
                    <td className="p-4">{h.fecha}</td>
                    <td className="p-4">Módulo {h.moduloHorario}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(h.estado)}`}>
                        {h.estado}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      {h.motivoRechazo ? (
                        <span className="text-red-600 italic">Motivo: {h.motivoRechazo}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Motivo de Rechazo (HU-03) */}
      {modalRechazoId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Rechazar Solicitud #{modalRechazoId}</h3>
            <p className="text-sm text-gray-600 mb-4">Informa el motivo del rechazo para notificar al docente.</p>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ej. Recurso en mantenimiento o franja horaria ocupada..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setModalRechazoId(null); setMotivoRechazo(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRechazo}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};