package com.ING.BibliotecaHorizonte.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void enviarRecordatorioReserva(String emailDestino, String detalleReserva) {
        logger.info("Enviando correo asíncrono a: {}", emailDestino);
        try {
            Thread.sleep(1500); // Simula el envío de correo / latencia SMTP
            logger.info("Correo enviado con éxito: {}", detalleReserva);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Error en el envío de correo asíncrono", e);
        }
    }
}
