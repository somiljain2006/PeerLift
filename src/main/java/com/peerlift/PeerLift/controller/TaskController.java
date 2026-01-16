package com.peerlift.PeerLift.controller;

import com.peerlift.PeerLift.dto.ApiResponse;
import com.peerlift.PeerLift.dto.task.CreateTaskRequest;
import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.entities.Task.Task;
import com.peerlift.PeerLift.entities.Task.TaskStatus;
import com.peerlift.PeerLift.repository.TaskRepository;
import com.peerlift.PeerLift.service.task.TaskService;
import com.peerlift.PeerLift.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;
	private final TaskRepository taskRepository;

	@PostMapping
	public ResponseEntity<ApiResponse<Task>> createTask(
		@RequestBody CreateTaskRequest request
	) {
		Users user = SecurityUtil.currentUser();
		Task task = taskService.createTask(request, user);
		return ResponseEntity.ok(new ApiResponse<>(200, "Task created", task));
	}

	@GetMapping("/open")
	public ResponseEntity<ApiResponse<List<Task>>> getOpenTasks() {
		List<Task> tasks = taskRepository.findByStatus(TaskStatus.OPEN);
		return ResponseEntity.ok(new ApiResponse<>(200, "Open tasks", tasks));
	}

	@PostMapping("/{taskId}/accept")
	public ResponseEntity<ApiResponse<String>> acceptTask(@PathVariable Long taskId) {
		Users user = SecurityUtil.currentUser();
		taskService.acceptTask(taskId, user);
		return ResponseEntity.ok(new ApiResponse<>(200, "Task accepted", null));
	}

	@GetMapping("/my-posted")
	public ResponseEntity<ApiResponse<List<Task>>> myPostedTasks() {
		Users user = SecurityUtil.currentUser();
		List<Task> tasks = taskRepository.findByPostedById(user.getId());
		return ResponseEntity.ok(new ApiResponse<>(200, "Your posted tasks", tasks));
	}

	@GetMapping("/my-accepted")
	public ResponseEntity<ApiResponse<List<Task>>> myAcceptedTasks() {
		Users user = SecurityUtil.currentUser();
		List<Task> tasks = taskRepository.findByAcceptedById(user.getId());
		return ResponseEntity.ok(new ApiResponse<>(200, "Your accepted tasks", tasks));
	}
}
