package com.peerlift.PeerLift.service.task;

import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.repository.userRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

	private final userRepository userRepo;

	public List<Users> getTopUsers() {
		return userRepo.findTop10ByOrderByCreditsDesc();
	}
}
