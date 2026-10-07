import React, { useState, useEffect } from 'react';
import type { Recurso } from '../types/solicitud';
import { solicitudService } from '../services/solicitudService';

interface Props {
  docenteDni: string;
  docenteNombre: string;
  onSolicitudCreada: () => void;
}

export const CatalogoYSolicitud: React.FC<Props> = ({ docenteDni, docenteNombre, onSolicitudCreada }) => {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState<Recurso | null>(null);
  
  // Formulario HU-01 / HU-09
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState<string>(hoy);
  const [moduloHorario, setModuloHorario] = useState<number>(1);
  const [enviando, setEnviando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    cargarRecursos();
  }, []);

  const cargarRecursos = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.obtenerRecursos();
      setRecursos(data);
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al cargar catálogo' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recursoSeleccionado) return;

    try {
      setEnviando(true);
      setMensaje(null);
      await solicitudService.crearSolicitud({
        docenteNombre,
        docenteDni,
        recursoId: recursoSeleccionado.id,
        fecha,
        moduloHorario: Number(moduloHorario),
      });
      setMensaje({ tipo: 'exito', texto: '¡Solicitud registrada con éxito en estado PENDIENTE!' });
      setRecursoSeleccionado(null);
      onSolicitudCreada();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al solicitar recurso' });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando catálogo de recursos...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Catálogo de Recursos Educativos</h2>
      <p className="text-gray-600 mb-6">Selecciona un equipo para realizar una solicitud de reserva.</p>

      {mensaje && (
        <div className={`p-4 mb-6 rounded-lg font-medium ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Grid HU-05 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {recursos.map((rec) => (
          <div key={rec.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold tracking-wider uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
              {rec.tipo}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-2">{rec.nombre}</h3>
            <p className="text-xs text-gray-500 mt-1">ID: #{rec.id}</p>
            <button
              onClick={() => { setRecursoSeleccionado(rec); setMensaje(null); }}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
            >
              Solicitar Reserva
            </button>
          </div>
        ))}
      </div>

      {/* Modal / Formulario HU-01 & HU-09 */}
      {recursoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Solicitar {recursoSeleccionado.nombre}</h3>
            <p className="text-xs text-gray-500 mb-4">Docente: {docenteNombre} (DNI: {docenteDni})</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de Uso</label>
                <input
                  type="date"
                  min={hoy} // HU-09: Deshabilitar fechas pasadas en el selector
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Módulo Horario</label>
                <select
                  value={moduloHorario}
                  onChange={(e) => setModuloHorario(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={1}>Módulo 1 (08:00 - 09:30)</option>
                  <option value={2}>Módulo 2 (09:40 - 11:10)</option>
                  <option value={3}>Módulo 3 (11:20 - 12:50)</option>
                  <option value={4}>Módulo 4 (13:30 - 15:00)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setRecursoSeleccionado(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : 'Confirmar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};