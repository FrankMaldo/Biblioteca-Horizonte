package com.ING.BibliotecaHorizonte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BibliotecaHorizonteApplication {

	public static void main(String[] args) {
		SpringApplication.run(BibliotecaHorizonteApplication.class, args);
	}

}
