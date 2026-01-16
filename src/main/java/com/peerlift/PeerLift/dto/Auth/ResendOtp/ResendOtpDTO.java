package com.peerlift.PeerLift.dto.Auth.ResendOtp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResendOtpDTO {

	String email;
	String token;

}
