package com.peerlift.PeerLift.controller;

import com.peerlift.PeerLift.dto.ApiResponse;
import com.peerlift.PeerLift.dto.Auth.Google.GoogleLoginRequest;
import com.peerlift.PeerLift.dto.Auth.Token.RefreshTokenResponse;
import com.peerlift.PeerLift.service.Interface.AuthInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class OAuthRegistrationController {

	private final AuthInterface authService;

	@PostMapping("/google")
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> googleLogin(@RequestBody GoogleLoginRequest request){
		ApiResponse<RefreshTokenResponse> response = authService.registerOrLoginWithGoogle(request.idToken());
		return ResponseEntity.status(response.getStatus()).body(response);
	}
}
