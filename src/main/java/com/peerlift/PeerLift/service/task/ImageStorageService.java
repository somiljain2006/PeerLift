package com.peerlift.PeerLift.service.task;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageStorageService {

	private static final String BASE_DIR = "uploads/solutions";

	public List<String> saveImages(List<MultipartFile> files) {

		try {
			File dir = new File(BASE_DIR);

			if (!dir.exists()) {
				boolean created = dir.mkdirs();
				if (!created) {
					throw new RuntimeException("Could not create upload directory");
				}
			}

			List<String> paths = new ArrayList<>();

			for (MultipartFile file : files) {

				if (file == null || file.isEmpty()) {
					continue;
				}

				String originalName = file.getOriginalFilename();
				String filename =
					UUID.randomUUID() + "_" + (originalName != null ? originalName : "image");

				Path destination = new File(dir, filename).toPath();

				Files.copy(
					file.getInputStream(),
					destination,
					StandardCopyOption.REPLACE_EXISTING
				);

				paths.add("/uploads/solutions/" + filename);
			}

			if (paths.isEmpty()) {
				throw new RuntimeException("No valid images uploaded");
			}

			return paths;

		} catch (Exception e) {
			throw new RuntimeException("Failed to store images", e);
		}
	}
}
