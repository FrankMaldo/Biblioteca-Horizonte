package com.ING.BibliotecaHorizonte.controller;

import com.ING.BibliotecaHorizonte.entity.Solicitud;
import com.ING.BibliotecaHorizonte.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    // HU-04: GET /api/solicitudes/mis-solicitudes?docenteDni=...
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<Solicitud>> obtenerMisSolicitudes(@RequestParam String docenteDni) {
        List<Solicitud> solicitudes = solicitudService.obtenerSolicitudesPorDocente(docenteDni);
        return ResponseEntity.ok(solicitudes);
    }

    // HU-07: PUT /api/solicitudes/{id}/cancelar
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarSolicitud(@PathVariable Long id) {
        try {
            Solicitud solicitudCancelada = solicitudService.cancelarSolicitud(id);
            return ResponseEntity.ok(solicitudCancelada);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}