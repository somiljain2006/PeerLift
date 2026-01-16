package com.peerlift.PeerLift.dto.Auth.ResendOtp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResendForgotOtpRequest {
	private String email;
	private String token;
}
