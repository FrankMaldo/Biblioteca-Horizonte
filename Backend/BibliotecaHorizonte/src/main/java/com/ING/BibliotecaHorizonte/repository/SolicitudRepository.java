package com.ING.BibliotecaHorizonte.repository;

import com.ING.BibliotecaHorizonte.entity.EstadoSolicitud;
import com.ING.BibliotecaHorizonte.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    // Regla de Oro: Buscar si ya existe una reserva CONFIRMADA para el mismo recurso, fecha y módulo
    boolean existsByRecursoIdAndFechaAndModuloHorarioAndEstado(
            Long recursoId, LocalDate fecha, Integer moduloHorario, EstadoSolicitud estado
    );

    // Búsqueda con Filtros dinámicos para el Panel de Administración (HU-08)
    @Query("SELECT s FROM Solicitud s WHERE " +
            "(:estado IS NULL OR s.estado = :estado) AND " +
            "(:fecha IS NULL OR s.fecha = :fecha) AND " +
            "(:docente IS NULL OR LOWER(s.docenteNombre) LIKE LOWER(CONCAT('%', :docente, '%')))")
    List<Solicitud> filtrarSolicitudes(
            @Param("estado") EstadoSolicitud estado,
            @Param("fecha") LocalDate fecha,
            @Param("docente") String docente
    );

    // Histórico de Solicitudes Procesadas (CONFIRMADA, RECHAZADA, CANCELADA) (HU-10)
    List<Solicitud> findByEstadoInOrderByFechaActualizacionDesc(List<EstadoSolicitud> estados);
}
