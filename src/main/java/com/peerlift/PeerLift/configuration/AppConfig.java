package com.peerlift.PeerLift.configuration;

import jakarta.annotation.Nonnull;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

	@Bean
	public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder){
		return new AuthenticationProvider(){

			@Override
			public Authentication authenticate(@Nonnull Authentication authentication)
				throws AuthenticationException{
				String username = authentication.getName();
				String password = String.valueOf(authentication.getCredentials());

				UserDetails user = userDetailsService.loadUserByUsername(username);

				if (!passwordEncoder.matches(password, user.getPassword())){
					throw new BadCredentialsException("Invalid username or password");
				}
				return new UsernamePasswordAuthenticationToken(user,
					null, user.getAuthorities());
			}

			@Override
			public boolean supports(@NonNull Class<?> authentication){
				return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
			}
		};
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
