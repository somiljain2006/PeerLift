package com.peerlift.PeerLift.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class JwtDecoderConfig{

	@Bean
	public JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withIssuerLocation("https://accounts.google.com").build();
	}

}
