package com.peerlift.PeerLift.controller;

import com.peerlift.PeerLift.dto.ApiResponse;
import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.service.task.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

	private final LeaderboardService leaderboardService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<Users>>> leaderboard() {
		List<Users> users = leaderboardService.getTopUsers();
		return ResponseEntity.ok(
			new ApiResponse<>(200, "Top contributors", users)
		);
	}
}
