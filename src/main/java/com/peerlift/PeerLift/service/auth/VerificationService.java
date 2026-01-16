package com.peerlift.PeerLift.service.auth;

import com.peerlift.PeerLift.dto.Auth.Login.LoginResponseDTO;
import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.repository.userRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

	private final UserNameService userNameService;
	private final PasswordEncoder passwordEncoder;
	private final userRepository userRepo;

	public boolean checkCredentials(Users user, String password) {
		if (user == null || password == null) return false;
		return passwordEncoder.matches(password, user.getPassword());
	}

	public LoginResponseDTO generateTokens(Users user) {
		String accessToken = userNameService.generateToken(user);

		String refreshToken = UUID.randomUUID().toString();
		user.setRefreshToken(refreshToken);
		user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
		userRepo.save(user);

		return new LoginResponseDTO(accessToken, refreshToken);
	}
}
