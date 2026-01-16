package com.peerlift.PeerLift.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class EmailValidator {

	private static final Pattern EMAIL_PATTERN =
		Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

	public boolean checkEmail(String email) {
		if (email == null) return false;
		return EMAIL_PATTERN.matcher(email).matches();
	}

	public String normaliseEmail(String email) {
		if (email == null) return null;
		else return email.trim().toLowerCase();
	}

}
