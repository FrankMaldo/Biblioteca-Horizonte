package com.ING.BibliotecaHorizonte.controller;

import com.ING.BibliotecaHorizonte.entity.Recurso;
import com.ING.BibliotecaHorizonte.repository.RecursoRepository;
import com.ING.BibliotecaHorizonte.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "*")
public class RecursoController {

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private RecursoRepository recursoRepository;

    // HU-05: Listar Catálogo Completo de Recursos para el Docente
    @GetMapping
    public ResponseEntity<List<Recurso>> obtenerCatalogo() {
        return ResponseEntity.ok(recursoRepository.findAll());
    }

    // HU-06: GET /api/recursos/{id}/disponibilidad?fecha=YYYY-MM-DD
    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<Map<String, Object>> consultarDisponibilidad(
            @PathVariable Long id,
            @RequestParam("fecha") String fechaStr) {
        LocalDate fecha = LocalDate.parse(fechaStr);
        Map<String, Object> disponibilidad = solicitudService.consultarDisponibilidad(id, fecha);
        return ResponseEntity.ok(disponibilidad);
    }
}