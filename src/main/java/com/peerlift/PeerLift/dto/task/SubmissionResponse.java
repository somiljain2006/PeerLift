package com.peerlift.PeerLift.dto.task;

import java.util.List;

public record SubmissionResponse(
	Long taskId,
	String submittedBy,
	List<String> imageUrls,
	Integer rating
) {}
