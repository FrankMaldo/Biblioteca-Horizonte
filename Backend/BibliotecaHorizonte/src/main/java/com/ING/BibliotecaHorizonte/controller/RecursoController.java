package com.ING.BibliotecaHorizonte.controller;

import com.ING.BibliotecaHorizonte.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "*")
public class RecursoController {

    @Autowired
    private SolicitudService solicitudService;

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