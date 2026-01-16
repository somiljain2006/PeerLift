package com.peerlift.PeerLift.service.task;

import com.peerlift.PeerLift.dto.task.CreateTaskRequest;
import com.peerlift.PeerLift.entities.Auth.Users;
import com.peerlift.PeerLift.entities.Task.Submission;
import com.peerlift.PeerLift.entities.Task.Task;
import com.peerlift.PeerLift.entities.Task.TaskStatus;
import com.peerlift.PeerLift.repository.SubmissionRepository;
import com.peerlift.PeerLift.repository.TaskRepository;
import com.peerlift.PeerLift.repository.userRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

	private final TaskRepository taskRepo;
	private final SubmissionRepository submissionRepo;
	private final userRepository userRepo;

	public Task createTask(CreateTaskRequest req, Users user) {
		Task task = new Task();
		task.setTitle(req.title());
		task.setDescription(req.description());
		task.setSubject(req.subject());
		task.setRewardCredits(req.rewardCredits());
		task.setPostedBy(user);
		return taskRepo.save(task);
	}

	public void acceptTask(Long taskId, Users user) {
		Task task = taskRepo.findById(taskId)
			.orElseThrow(() -> new RuntimeException("Task not found"));

		if (task.getStatus() != TaskStatus.OPEN) {
			throw new RuntimeException("Task already accepted");
		}

		if (task.getPostedBy().getId().equals(user.getId())) {
			throw new RuntimeException("You cannot accept your own task");
		}

		task.setAcceptedBy(user);
		task.setStatus(TaskStatus.ACCEPTED);
		taskRepo.save(task);
	}

	public void submitSolution(
		Long taskId,
		List<String> imageUrls,
		Users user
	) {
		Task task = taskRepo.findById(taskId)
			.orElseThrow(() -> new RuntimeException("Task not found"));

		if (task.getStatus() != TaskStatus.ACCEPTED) {
			throw new RuntimeException("Task not in accepted state");
		}

		if (!task.getAcceptedBy().getId().equals(user.getId())) {
			throw new RuntimeException("Only accepted user can submit");
		}

		if (imageUrls == null || imageUrls.isEmpty()) {
			throw new RuntimeException("At least one image is required");
		}

		Submission submission = new Submission();
		submission.setTask(task);
		submission.setSubmittedBy(user);
		submission.setImageUrls(Collections.singletonList(String.valueOf(imageUrls)));

		submissionRepo.save(submission);

		task.setStatus(TaskStatus.COMPLETED);
		task.setCompletedAt(LocalDateTime.now());
		taskRepo.save(task);
	}


	public void rateSubmission(Long taskId, int rating, Users rater) {

		Task task = taskRepo.findById(taskId)
			.orElseThrow(() -> new RuntimeException("Task not found"));

		if (!task.getPostedBy().getId().equals(rater.getId())) {
			throw new RuntimeException("Only task owner can rate");
		}

		Submission submission = submissionRepo.findByTaskId(taskId)
			.orElseThrow(() -> new RuntimeException("Submission not found"));

		if (rating < 1 || rating > 5) {
			throw new RuntimeException("Rating must be between 1 and 5");
		}
		submissionRepo.save(submission);

		Users solver = submission.getSubmittedBy();

		if (rating >= 4) {
			solver.setCredits(solver.getCredits() + task.getRewardCredits());
		} else if (rating == 3) {
			solver.setCredits(
				solver.getCredits() + (task.getRewardCredits() * 70 / 100)
			);
		}

		solver.setTasksCompleted(solver.getTasksCompleted() + 1);

		int completed = solver.getTasksCompleted();

		double newRating = ((solver.getRating() * (completed - 1)) + rating) / completed;

		solver.setRating(newRating);

		userRepo.save(solver);
	}

}

