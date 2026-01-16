package com.peerlift.PeerLift;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PeerLiftApplication {

	static void main(String[] args) {
		SpringApplication.run(PeerLiftApplication.class, args);
	}

}
