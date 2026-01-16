package com.peerlift.PeerLift.repository;

import com.peerlift.PeerLift.entities.Auth.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface userRepository extends JpaRepository<Users, UUID> {

	Optional<Users> findByEmail(String email);

	boolean existsByEmail(String email);

	Optional<Users> findByUsernameIgnoreCase(String username);

	boolean existsByUsername(String username);

	Optional<Users> findByRefreshToken(String refreshToken);

	List<Users> findTop10ByOrderByCreditsDesc();

}
