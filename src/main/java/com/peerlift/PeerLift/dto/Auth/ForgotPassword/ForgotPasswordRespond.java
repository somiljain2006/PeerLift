package com.peerlift.PeerLift.dto.Auth.ForgotPassword;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ForgotPasswordRespond{

	public ForgotPasswordRespond(String token){
		this.token = token;
	}

	private String token;

}
