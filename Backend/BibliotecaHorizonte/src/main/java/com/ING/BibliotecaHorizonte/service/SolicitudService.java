package com.ING.BibliotecaHorizonte.service;

import com.ING.BibliotecaHorizonte.entity.EstadoSolicitud;
import com.ING.BibliotecaHorizonte.entity.Solicitud;
import com.ING.BibliotecaHorizonte.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private EmailService emailService;

    // HU-04: Consultar solicitudes filtrando por DNI del docente
    public List<Solicitud> obtenerSolicitudesPorDocente(String docenteDni) {
        return solicitudRepository.findByDocenteDni(docenteDni);
    }

    // HU-07 y HU-12: Cancelar solicitud validando estado PENDIENTE y notificando de forma asíncrona
    public Solicitud cancelarSolicitud(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + id));
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden cancelar solicitudes que se encuentren en estado PENDIENTE.");
        }

        solicitud.setEstado(EstadoSolicitud.CANCELADA);
        Solicitud solicitudGuardada = solicitudRepository.save(solicitud);

        // Disparar servicio asíncrono de notificación (HU-12)
        emailService.enviarRecordatorioReserva(
                "docente@horizonte.edu", // O el correo que manejes en tu entidad si lo agregas
                "Su solicitud #" + id + " ha sido cancelada exitosamente."
        );

        return solicitudGuardada;
    }

    // HU-06: Consultar disponibilidad módulo por módulo para un recurso y fecha
    public Map<String, Object> consultarDisponibilidad(Long recursoId, LocalDate fecha) {
        // Módulos horarios institucionales estándar (representados como enteros)
        List<Integer> modulosTotales = List.of(1, 2, 3, 4);
        List<Map<String, Object>> disponibilidadPorModulo = new ArrayList<>();

        for (Integer modulo : modulosTotales) {
            Map<String, Object> estadoModulo = new HashMap<>();
            estadoModulo.put("moduloHorario", modulo);

            boolean estaConfirmado = solicitudRepository.existsByRecursoIdAndFechaAndModuloHorarioAndEstado(
                    recursoId, fecha, modulo, EstadoSolicitud.CONFIRMADA
            );

            boolean estaPendiente = solicitudRepository.existsByRecursoIdAndFechaAndModuloHorarioAndEstado(
                    recursoId, fecha, modulo, EstadoSolicitud.PENDIENTE
            );

            if (estaConfirmado) {
                estadoModulo.put("estado", "CONFIRMADA");
            } else if (estaPendiente) {
                estadoModulo.put("estado", "PENDIENTE");
            } else {
                estadoModulo.put("estado", "LIBRE");
            }

            disponibilidadPorModulo.add(estadoModulo);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("recursoId", recursoId);
        response.put("fecha", fecha);
        response.put("disponibilidad", disponibilidadPorModulo);

        return response;
    }
}
