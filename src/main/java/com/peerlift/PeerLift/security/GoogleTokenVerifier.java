package com.peerlift.PeerLift.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
@Profile("google")
public class GoogleTokenVerifier {

	private final JwtDecoder jwtDecoder;

	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	private String clientId;

	public GoogleTokenVerifier(JwtDecoder jwtDecoder) {
		this.jwtDecoder = jwtDecoder;
	}

	public Jwt verify(String idToken){
		Jwt jwt = jwtDecoder.decode(idToken);

		if(!jwt.getAudience().contains(clientId)){
			throw new RuntimeException("Invalid Google token audience");
		}

		if(!"https://accounts.google.com".equals(jwt.getIssuer().toString())){
			throw new RuntimeException("Invalid Google token issuer");
		}

		Boolean emailVerified = jwt.getClaim("email_verified");
		if(emailVerified == null || !emailVerified){
			throw new RuntimeException("Google email not verified");
		}

		return jwt;
	}
}
