package com.peerlift.PeerLift.configuration;

import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.service.auth.UserNameService;
import com.peerlift.PeerLift.service.auth.UserService;
import io.jsonwebtoken.Claims;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.function.Function;

@Component
public class Filter extends OncePerRequestFilter {

	private final UserService userService;
	private final UserNameService usernameService;

	public Filter(UserNameService usernameService, UserService userService) {
		this.usernameService = usernameService;
		this.userService = userService;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {

		String path = request.getRequestURI();
		return path.startsWith("/api/v1/auth/") || "OPTIONS".equalsIgnoreCase(request.getMethod());
	}

	@Override
	protected void doFilterInternal(@Nonnull HttpServletRequest request,
																	@Nonnull HttpServletResponse response,
																	@Nonnull FilterChain filterChain)
		throws ServletException, IOException {

		final String header = request.getHeader("Authorization");
		String token = null;
		String userName = null;

		if (header != null && header.startsWith("Bearer ")) {
			token = header.substring(7);
			try {
				userName = usernameService.extractUsername(token);
			} catch (Exception e) {
				filterChain.doFilter(request, response);
				return;
			}
		}

		if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = userService.loadUserByUsername(userName);
			Users user = (Users) userDetails;

			Claims claims = usernameService.extractClaim(token, Function.identity());
			Integer tokenVersion = (Integer) claims.get("passwordVersion");

			if (usernameService.validToken(token, user) && tokenVersion == user.getPasswordVersion()) {
				UsernamePasswordAuthenticationToken authToken =
					new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}

		filterChain.doFilter(request, response);
	}
}
