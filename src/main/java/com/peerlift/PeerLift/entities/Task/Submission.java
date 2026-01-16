package com.peerlift.PeerLift.entities.Task;

import com.peerlift.PeerLift.entities.Auth.Users;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Submission {

	@Id
	@GeneratedValue
	private Long id;

	@OneToOne
	@JoinColumn(name = "task_id", unique = true)
	private Task task;

	@ManyToOne
	private Users submittedBy;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "submission_images")
	@Column(name = "image_url")
	private List<String> imageUrls;

	private Integer rating;
}

