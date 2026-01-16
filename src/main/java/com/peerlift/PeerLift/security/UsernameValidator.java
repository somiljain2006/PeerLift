package com.peerlift.PeerLift.security;

import org.springframework.stereotype.Component;

@Component
public class UsernameValidator {

	private static final int MIN_LENGTH = 4;
	private static final int MAX_LENGTH = 30;

	private static final String USERNAME_REGEX = "^[A-Za-z0-9._-]+$";

	public static String validate(String username) {

		if (username == null || username.isBlank()) {
			return "Username cannot be empty.";
		}

		if (username.length() < MIN_LENGTH) {
			return "Username must be at least " + MIN_LENGTH + " characters long.";
		}

		if (username.length() > MAX_LENGTH) {
			return "Username cannot exceed " + MAX_LENGTH + " characters.";
		}

		if (!username.matches(USERNAME_REGEX)) {
			return "Username can only contain letters, numbers, dots, hyphens, and underscores.";
		}

		if (username.contains("@")) {
			return "Username cannot contain '@' or look like an email.";
		}

		if (username.contains("..") || username.contains("__") || username.contains("--")) {
			return "Username cannot contain repeated special characters.";
		}

		return null;
	}

	public boolean checkUsername(String username) {
		return validate(username) == null;
	}

}
