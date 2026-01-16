package com.peerlift.PeerLift.controller;

import com.peerlift.PeerLift.dto.ApiResponse;
import com.peerlift.PeerLift.dto.task.RateSubmissionRequest;
import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.service.task.ImageStorageService;
import com.peerlift.PeerLift.service.task.TaskService;
import com.peerlift.PeerLift.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

	private final TaskService taskService;
	private final ImageStorageService imageStorageService;

	@PostMapping(
		value = "/{taskId}/submit",
		consumes = "multipart/form-data"
	)
	public ResponseEntity<ApiResponse<String>> submitSolution(
		@PathVariable Long taskId,
		@RequestParam("images") List<MultipartFile> images
	) {
		Users user = SecurityUtil.currentUser();

		List<String> imageUrls = imageStorageService.saveImages(images);

		taskService.submitSolution(taskId, imageUrls, user);

		return ResponseEntity.ok(
			new ApiResponse<>(200, "Solution images submitted", null)
		);
	}

	@PostMapping("/{taskId}/rate")
	public ResponseEntity<ApiResponse<String>> rateSubmission(
		@PathVariable Long taskId,
		@RequestBody RateSubmissionRequest request
	) {
		Users user = SecurityUtil.currentUser();
		taskService.rateSubmission(taskId, request.rating(), user);
		return ResponseEntity.ok(new ApiResponse<>(200, "Submission rated", null));
	}
}
