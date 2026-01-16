package com.peerlift.PeerLift.dto.Auth.Registration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequestDTO {

	@NotBlank(message = "email is missing")
	@Size(min = 1, max = 100, message = "Email should be under 100 characters")
	@Pattern(
		regexp = "^\\s*[^\\s@]+@[^\\s@]+\\.[^\\s@]+\\s*$",
		message = "Invalid email format or contains spaces inside"
	)
	String email;

	@NotBlank(message = "Username is missing")
	@Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
	@Pattern(
		regexp = "^(?![_.])(?!.*[_.]{2})[A-Za-z0-9._]+(?<![_.])$",
		message = "Username can only contain letters, digits, underscores, and dots, " +
			"cannot start/end with them, or contain consecutive symbols"
	)
	String username;

	@NotBlank(message = "Password is missing")
	@Pattern(
		regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!])(?!.*\\s).+$",
		message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, "
			+ "one special character, and no spaces"
	)
	@Size(max = 16, message = "Password must not exceed 16 characters")
	String password;

}
