package com.peerlift.PeerLift.service.Interface;


import com.peerlift.PeerLift.dto.ApiResponse;
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

public interface AuthInterface {

    ApiResponse<LoginResponseDTO> login(LoginDTO request);

    ApiResponse<String> registration(RegistrationRequestDTO request);

    ApiResponse<?> validateRegistrationOtp(RegistrationOtpDTO request);

    ApiResponse<String> forgotPassword(String email);

    ApiResponse<ForgotPasswordRespond> validateForgotOtp(ValidateForgotOtpRequest request);

    ApiResponse<String> resendOTP(ResendOtpDTO request);

    ApiResponse<String> resendForgotPasswordOtp(ResendForgotOtpRequest request);

    ApiResponse<String> resetPassword(ResetPasswordRequest request);

    ApiResponse<RefreshTokenResponse> registerOrLoginWithGoogle(String idToken);

    ApiResponse<RefreshTokenResponse> refreshAccessToken(RefreshTokenRequest request);

    ApiResponse<UsernameAvailability> checkUsername(String username);

}
