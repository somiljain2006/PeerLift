package com.peerlift.PeerLift.utils;

import com.peerlift.PeerLift.entities.Auth.Users;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

	private SecurityUtil() {}

	public static Users currentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (auth == null || !(auth.getPrincipal() instanceof Users user)) {
			throw new IllegalStateException("Unauthenticated request");
		}
		return user;
	}
}

