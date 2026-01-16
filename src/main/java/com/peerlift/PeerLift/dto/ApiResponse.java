package com.peerlift.PeerLift.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

	public ApiResponse(int status, String message) {
		this.status = status;
		this.message = message;
	}

	private int status;
	private String message;

	@Nullable
	private T data;

}
