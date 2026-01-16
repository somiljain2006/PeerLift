package com.peerlift.PeerLift.dto.Auth.Registration;

import com.peerlift.PeerLift.entities.OTP.OtpType;
import lombok.Data;

@Data
public class RegistrationOtpDTO {

	private String email;
	private String otp;
	private OtpType type;
	private String Token;

}
