package com.ING.BibliotecaHorizonte.controller;

import com.ING.BibliotecaHorizonte.dtos.RechazoRequest;
import com.ING.BibliotecaHorizonte.dtos.SolicitudDTO;
import com.ING.BibliotecaHorizonte.entity.EstadoSolicitud;
import com.ING.BibliotecaHorizonte.entity.Recurso;
import com.ING.BibliotecaHorizonte.entity.Solicitud;
import com.ING.BibliotecaHorizonte.repository.RecursoRepository;
import com.ING.BibliotecaHorizonte.repository.SolicitudRepository;
import com.ING.BibliotecaHorizonte.service.AdminService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final SolicitudRepository solicitudRepository;
    private final RecursoRepository recursoRepository;

    public AdminController(AdminService adminService, SolicitudRepository solicitudRepository, RecursoRepository recursoRepository) {
        this.adminService = adminService;
        this.solicitudRepository = solicitudRepository;
        this.recursoRepository = recursoRepository;
    }

    // HU-02: Confirmar Solicitud
    @PutMapping("/solicitudes/{id}/confirmar")
    public ResponseEntity<?> confirmarSolicitud(@PathVariable Long id) {
        try {
            Solicitud confirmada = adminService.confirmarSolicitud(id);
            return ResponseEntity.ok(confirmada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensaje", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensaje", e.getMessage()));
        }
    }

    // HU-03: Rechazar Solicitud
    @PutMapping("/solicitudes/{id}/rechazar")
    public ResponseEntity<?> rechazarSolicitud(@PathVariable Long id, @RequestBody(required = false) RechazoRequest req) {
        try {
            String motivo = (req != null) ? req.getMotivo() : null;
            Solicitud rechazada = adminService.rechazarSolicitud(id, motivo);
            return ResponseEntity.ok(rechazada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensaje", e.getMessage()));
        }
    }

    // HU-08: Panel Administrativo con Filtros Dinámicos
    @GetMapping("/admin/solicitudes")
    public ResponseEntity<List<Solicitud>> listarSolicitudes(
            @RequestParam(required = false) EstadoSolicitud estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) String docente
    ) {
        return ResponseEntity.ok(adminService.listarConFiltros(estado, fecha, docente));
    }

    // HU-10: Histórico de Reservas Finalizadas
    @GetMapping("/admin/historico")
    public ResponseEntity<List<Solicitud>> obtenerHistorico() {
        return ResponseEntity.ok(adminService.obtenerHistorico());
    }


    // Permite cargar los 6 recursos de la biblioteca rápidamente
    @PostMapping("/admin/inicializar-recursos")
    public ResponseEntity<?> inicializarRecursos() {
        if (recursoRepository.count() == 0) {
            recursoRepository.save(new Recurso("Proyector 1", "PROYECTOR", true));
            recursoRepository.save(new Recurso("Proyector 2", "PROYECTOR", true));
            recursoRepository.save(new Recurso("Notebook 1", "NOTEBOOK", true));
            recursoRepository.save(new Recurso("Notebook 2", "NOTEBOOK", true));
            recursoRepository.save(new Recurso("Notebook 3", "NOTEBOOK", true));
            recursoRepository.save(new Recurso("Notebook 4", "NOTEBOOK", true));
            return ResponseEntity.ok(Map.of("mensaje", "6 recursos cargados correctamente."));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Los recursos ya estaban inicializados."));
    }

    // Permite crear una solicitud de prueba desde Postman
    @PostMapping("/solicitudes")
    public ResponseEntity<?> crearSolicitudPrueba(@RequestBody SolicitudDTO dto) {
        Recurso recurso = recursoRepository.findById(dto.getRecursoId())
                .orElseThrow(() -> new IllegalArgumentException("Recurso no encontrado"));

        Solicitud solicitud = new Solicitud();
        solicitud.setDocenteNombre(dto.getDocenteNombre());
        solicitud.setDocenteDni(dto.getDocenteDni());
        solicitud.setRecurso(recurso);
        solicitud.setFecha(dto.getFecha());
        solicitud.setModuloHorario(dto.getModuloHorario());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);

        Solicitud guardada = solicitudRepository.save(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }
}
