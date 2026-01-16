package com.peerlift.PeerLift.dto.Auth.Token;

public record RefreshTokenResponse(
	String accessToken,
	String refreshToken
) { }
