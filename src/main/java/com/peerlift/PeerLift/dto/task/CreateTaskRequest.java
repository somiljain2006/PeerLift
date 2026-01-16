package com.peerlift.PeerLift.dto.task;

public record CreateTaskRequest(
	String title,
	String description,
	String subject,
	int rewardCredits
) {}

