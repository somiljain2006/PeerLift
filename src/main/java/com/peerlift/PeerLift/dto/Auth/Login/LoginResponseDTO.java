package com.peerlift.PeerLift.dto.Auth.Login;

public record LoginResponseDTO(
	String accessToken,
	String refreshToken
) { }
