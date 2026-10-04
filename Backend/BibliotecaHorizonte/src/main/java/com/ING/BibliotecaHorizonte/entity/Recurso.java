package com.ING.BibliotecaHorizonte.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recursos")
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre; // ej. Proyector 1, Notebook 3

    @Column(nullable = false)
    private String tipo; // ej. PROYECTOR, NOTEBOOK

    @Column(nullable = false)
    private Boolean disponible = true;

    public Recurso() {
    }

    public Recurso(String nombre, String tipo, Boolean disponible) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.disponible = disponible;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
