package com.peerlift.PeerLift.repository;

import com.peerlift.PeerLift.entities.Task.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

	Optional<Submission> findByTaskId(Long taskId);
}

