package com.peerlift.PeerLift.repository;

import com.peerlift.PeerLift.entities.Task.Task;
import com.peerlift.PeerLift.entities.Task.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByStatus(TaskStatus status);

	List<Task> findByPostedById(java.util.UUID userId);

	List<Task> findByAcceptedById(java.util.UUID userId);
}
