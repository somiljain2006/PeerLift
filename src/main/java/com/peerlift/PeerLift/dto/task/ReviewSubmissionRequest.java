package com.peerlift.PeerLift.dto.task;

import com.peerlift.PeerLift.entities.Task.SubmissionStatus;

public record ReviewSubmissionRequest(
	SubmissionStatus status,
	String feedback
) {}

