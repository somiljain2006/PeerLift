package com.peerlift.PeerLift.dto.Auth.ResetPassword;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

	private String newPassword;
	private String Token;

}

