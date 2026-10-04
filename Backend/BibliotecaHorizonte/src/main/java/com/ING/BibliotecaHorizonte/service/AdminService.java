package com.ING.BibliotecaHorizonte.service;

import com.ING.BibliotecaHorizonte.entity.EstadoSolicitud;
import com.ING.BibliotecaHorizonte.entity.Solicitud;
import com.ING.BibliotecaHorizonte.repository.SolicitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final SolicitudRepository solicitudRepository;

    public AdminService(SolicitudRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    // HU-02: Confirmar Solicitud con validación de la Regla de Oro
    @Transactional
    public Solicitud confirmarSolicitud(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La solicitud especificada no existe."));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden confirmar solicitudes en estado PENDIENTE.");
        }

        // Validación de la Regla de Oro (RF07 / HU-02)
        boolean existeConfirmada = solicitudRepository.existsByRecursoIdAndFechaAndModuloHorarioAndEstado(
                solicitud.getRecurso().getId(),
                solicitud.getFecha(),
                solicitud.getModuloHorario(),
                EstadoSolicitud.CONFIRMADA
        );

        if (existeConfirmada) {
            throw new IllegalStateException("Conflicto: El recurso ya posee una reserva confirmada para esta fecha y módulo.");
        }

        solicitud.setEstado(EstadoSolicitud.CONFIRMADA);
        return solicitudRepository.save(solicitud);
    }

    // HU-03: Rechazar Solicitud
    @Transactional
    public Solicitud rechazarSolicitud(Long id, String motivo) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La solicitud especificada no existe."));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden rechazar solicitudes en estado PENDIENTE.");
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitud.setMotivoRechazo(motivo);
        return solicitudRepository.save(solicitud);
    }

    // HU-08: Filtrar Solicitudes
    public List<Solicitud> listarConFiltros(EstadoSolicitud estado, LocalDate fecha, String docente) {
        return solicitudRepository.filtrarSolicitudes(estado, fecha, docente);
    }

    // HU-10: Consultar Histórico
    public List<Solicitud> obtenerHistorico() {
        return solicitudRepository.findByEstadoInOrderByFechaActualizacionDesc(
                List.of(EstadoSolicitud.CONFIRMADA, EstadoSolicitud.RECHAZADA, EstadoSolicitud.CANCELADA)
        );
    }
}
