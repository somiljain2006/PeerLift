package com.peerlift.PeerLift.controller;

import com.peerlift.PeerLift.dto.ApiResponse;
import com.peerlift.PeerLift.dto.Auth.ForgotPassword.EmailRequest;
import com.peerlift.PeerLift.dto.Auth.ForgotPassword.ForgotPasswordRespond;
import com.peerlift.PeerLift.dto.Auth.ForgotPassword.ValidateForgotOtpRequest;
import com.peerlift.PeerLift.dto.Auth.Login.LoginDTO;
import com.peerlift.PeerLift.dto.Auth.Login.LoginResponseDTO;
import com.peerlift.PeerLift.dto.Auth.Registration.RegistrationOtpDTO;
import com.peerlift.PeerLift.dto.Auth.Registration.RegistrationRequestDTO;
import com.peerlift.PeerLift.dto.Auth.ResendOtp.ResendForgotOtpRequest;
import com.peerlift.PeerLift.dto.Auth.ResendOtp.ResendOtpDTO;
import com.peerlift.PeerLift.dto.Auth.ResetPassword.ResetPasswordRequest;
import com.peerlift.PeerLift.dto.Auth.Token.RefreshTokenRequest;
import com.peerlift.PeerLift.dto.Auth.Token.RefreshTokenResponse;
import com.peerlift.PeerLift.dto.Auth.Username.UsernameAvailability;
import com.peerlift.PeerLift.service.Interface.AuthInterface;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthInterface authService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@RequestBody LoginDTO request) {
		ApiResponse<LoginResponseDTO> response = authService.login(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/registration")
	public ResponseEntity<ApiResponse<String>> registration(@Valid @RequestBody RegistrationRequestDTO request) {
		ApiResponse<String> response = authService.registration(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/validateRegistration")
	public ResponseEntity<ApiResponse<?>> validateRegistrationOTP(
		@RequestBody RegistrationOtpDTO request) {
		ApiResponse<?> response = authService.validateRegistrationOtp(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/forgotPassword")
	public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody EmailRequest request) {
		ApiResponse<String> response = authService.forgotPassword(request.getEmail());
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("validateForgotPassword")
	public ResponseEntity<ApiResponse<ForgotPasswordRespond>> validateForgotOtp(
		@RequestBody ValidateForgotOtpRequest request) {
		ApiResponse<ForgotPasswordRespond> response = authService.validateForgotOtp(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/resendotp")
	public ResponseEntity<ApiResponse<String>> resendOTP(@RequestBody ResendOtpDTO request) {
		ApiResponse<String> response = authService.resendOTP(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/resendForgotOtp")
	public ResponseEntity<ApiResponse<String>> resendForgotPasswordOtp(
		@RequestBody ResendForgotOtpRequest request) {
		ApiResponse<String> response = authService.resendForgotPasswordOtp(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/resetpassword")
	public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
		ApiResponse<String> response = authService.resetPassword(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
		@RequestBody RefreshTokenRequest request) {
		ApiResponse<RefreshTokenResponse> response = authService.refreshAccessToken(request);
		return ResponseEntity.status(response.getStatus()).body(response);
	}

	@GetMapping("/check-username")
	public ResponseEntity<ApiResponse<UsernameAvailability>> checkUsername(@RequestParam String username) {
		ApiResponse<UsernameAvailability> response = authService.checkUsername(username);
		return ResponseEntity.status(response.getStatus()).body(response);

	}

}
