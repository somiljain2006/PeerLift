package com.peerlift.PeerLift.entities.Task;

import com.peerlift.PeerLift.entities.Auth.Users;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String description;
	private String subject;

	private int rewardCredits;

	@Enumerated(EnumType.STRING)
	private TaskStatus status = TaskStatus.OPEN;

	@ManyToOne
	private Users postedBy;

	@ManyToOne
	private Users acceptedBy;

	private LocalDateTime createdAt;
	private LocalDateTime completedAt;

	@PrePersist
	void onCreate() {
		createdAt = LocalDateTime.now();
	}

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "task_images", joinColumns = @JoinColumn(name = "task_id"))
	@Column(name = "image_url")
	private List<String> imageUrls;

}

