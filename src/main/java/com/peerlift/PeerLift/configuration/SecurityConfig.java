package com.peerlift.PeerLift.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

	private final Filter filter;
	private final AuthenticationProvider authenticationProvider;

	public SecurityConfig(Filter filter, AuthenticationProvider authenticationProvider) {
		this.filter = filter;
		this.authenticationProvider = authenticationProvider;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		config.setAllowedHeaders(List.of("*"));
		config.setExposedHeaders(List.of("Authorization"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain apiSecurity(HttpSecurity http) {
		http
			.cors(withDefaults())
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(s ->
				s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/api/v1/auth/**").permitAll()
				.requestMatchers("/api/v1/tasks").permitAll()
				.requestMatchers("/api/v1/leaderboard/**").permitAll()
				.requestMatchers("/api/v1/tasks/**").permitAll()
				.anyRequest().authenticated())
			.authenticationProvider(authenticationProvider)
			.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.oauth2Login(AbstractHttpConfigurer::disable);

		return http.build();
	}

}
