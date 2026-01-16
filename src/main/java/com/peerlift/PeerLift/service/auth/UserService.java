package com.peerlift.PeerLift.service.auth;

import com.peerlift.PeerLift.repository.userRepository;
import com.peerlift.PeerLift.security.UsernameValidator;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

	private final userRepository userRepo;
	private final UsernameValidator validator;

	@Override
	public @NonNull UserDetails loadUserByUsername(@Nonnull String username) throws UsernameNotFoundException {

		if (validator.checkUsername(username)) {
			return userRepo.findByUsernameIgnoreCase(username).orElseThrow(() ->
				new UsernameNotFoundException("User not found"));
		}
		throw new UsernameNotFoundException("Invalid username:" + username);
	}
}
