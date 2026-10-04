package com.ING.BibliotecaHorizonte.dtos;

import java.time.LocalDate;

public class SolicitudDTO {
    private String docenteNombre;
    private String docenteDni;
    private Long recursoId;
    private LocalDate fecha;
    private Integer moduloHorario;

    public String getDocenteNombre() { return docenteNombre; }
    public void setDocenteNombre(String docenteNombre) { this.docenteNombre = docenteNombre; }

    public String getDocenteDni() { return docenteDni; }
    public void setDocenteDni(String docenteDni) { this.docenteDni = docenteDni; }

    public Long getRecursoId() { return recursoId; }
    public void setRecursoId(Long recursoId) { this.recursoId = recursoId; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Integer getModuloHorario() { return moduloHorario; }
    public void setModuloHorario(Integer moduloHorario) { this.moduloHorario = moduloHorario; }
}