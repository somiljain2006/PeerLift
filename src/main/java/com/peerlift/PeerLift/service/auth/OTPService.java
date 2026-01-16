package com.peerlift.PeerLift.service.auth;

import com.peerlift.PeerLift.dto.Auth.Registration.RegistrationRequestDTO;
import com.peerlift.PeerLift.entities.OTP.OtpType;
import com.peerlift.PeerLift.security.EmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OTPService {

	private final RedisService redisService;
	private final EmailValidator emailValidator;
	private final EmailService emailService;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private static final int OTP_GENERATE_LIMIT = 5;
	private static final int OTP_LIMIT_WINDOW_SECONDS = 900;
	private static final int OTP_EXPIRE_SECONDS = 300;
	private static final int COOLDOWN_SECONDS = 30;
	private static final int TEMP_REGISTRATION_EXPIRE = 600;
	private static final int BLOCK_DURATION = 300;

	private static final SecureRandom random = new SecureRandom();

	private String createOTP() {
		int otp = 100000 + random.nextInt(900000);
		return String.valueOf(otp);
	}

	public void sendOTP(String email, OtpType type) {

		if (hasExceededOtpLimit(email, type)) {
			long remaining = remainingLimitTime(email, type);
			throw new RuntimeException("OTP request limit exceeded. Try again after " + remaining + " seconds.");
		}

		String usedKey = "OTP_USED_" + type + "_" + email;
		redisService.deleteValue(usedKey);

		String otp = createOTP();
		String otpKey = "OTP_" + type + "_" + email;
		String cooldownKey = "OTP_COOLDOWN_" + type + "_" + email;

		redisService.saveValue(otpKey, otp, OTP_EXPIRE_SECONDS);
		redisService.saveValue(cooldownKey, "1", COOLDOWN_SECONDS);

		if (emailValidator.checkEmail(email)) {
			String message = "Your OTP is: " + otp + ". It will expire in 5 minutes.";
			emailService.sendEmail(email, message);
		} else {
			throw new RuntimeException("Invalid email type for sending OTP.");
		}
	}

	public boolean validateOTP(String email, String otp, OtpType type) {
		String key = "OTP_" + type + "_" + email;
		String savedOtp = redisService.getValue(key);
		return savedOtp != null && savedOtp.equals(otp);
	}

	public boolean isUsed(String email, OtpType type) {
		String key = "OTP_USED_" + type + "_" + email;
		return redisService.exists(key);
	}

	public void markAsUsed(String email, String otp, OtpType type) {
		String usedKey = "OTP_USED_" + type + "_" + email;
		redisService.saveValue(usedKey, otp, OTP_EXPIRE_SECONDS);

		String otpKey = "OTP_" + type + "_" + email;
		redisService.deleteValue(otpKey);

		String attemptKey = "OTP_ATTEMPTS_" + type + "_" + email;
		redisService.deleteValue(attemptKey);
	}

	public boolean isInCooldown(String email, OtpType type) {
		String key = "OTP_COOLDOWN_" + type + "_" + email;
		Long liveTime = redisService.getLiveTime(key);
		return liveTime != null && liveTime > 0;
	}

	public long cooldownTime(String email, OtpType type) {
		String key = "OTP_COOLDOWN_" + type + "_" + email;
		Long liveTime = redisService.getLiveTime(key);
		return (liveTime != null && liveTime > 0) ? liveTime : 0;
	}

	public void saveTempOtp(String email, RegistrationRequestDTO request) {
		try {
			String convertedKey = objectMapper.writeValueAsString(request);
			String key = "REGISTRATION_TEMP_" + email;
			redisService.saveValue(key, convertedKey, TEMP_REGISTRATION_EXPIRE);
		} catch (Exception e) {
			throw new RuntimeException("Failed to save temporary registration", e);
		}
	}

	public RegistrationRequestDTO getTempOtp(String email) {
		try {
			String key = "REGISTRATION_TEMP_" + email;
			String json = redisService.getValue(key);
			if (json == null) return null;
			return objectMapper.readValue(json, RegistrationRequestDTO.class);
		} catch (Exception e) {
			return null;
		}
	}

	public void deleteTempOtp(String email) {
		String key = "REGISTRATION_TEMP_" + email;
		redisService.deleteValue(key);
	}

	public void deleteOTP(String email, OtpType type) {
		String key = "OTP_" + type + "_" + email;
		redisService.deleteValue(key);
	}

	public long incrementOtpAttempts(String email, OtpType type) {
		String attemptKey = "OTP_ATTEMPTS_" + type + "_" + email;
		Long attempts = redisService.incrementValue(attemptKey);
		if (attempts == 1) redisService.setExpiry(attemptKey, BLOCK_DURATION);
		return attempts;
	}

	public void blockOtp(String email, OtpType type) {
		String blockKey = "OTP_BLOCKED_" + type + "_" + email;
		redisService.saveValue(blockKey, "1", BLOCK_DURATION);
	}

	public boolean isBlocked(String email, OtpType type) {
		String blockKey = "OTP_BLOCKED_" + type + "_" + email;
		return redisService.exists(blockKey);
	}

	public void deleteRegistrationSessionToken(String token) {
		if (token == null) {
			return;
		}
		String key = "REG_SESSION_" + token;
		redisService.deleteValue(key);
	}

	private String otpLimitKey(String email, OtpType type) {
		return "OTP_LIMIT_" + type + "_" + email;
	}

	private boolean hasExceededOtpLimit(String email, OtpType type) {
		String limitKey = otpLimitKey(email, type);
		Long attempts = redisService.incrementValue(limitKey);
		if (attempts == 1) {
			redisService.setExpiry(limitKey, OTP_LIMIT_WINDOW_SECONDS);
		}
		return attempts > OTP_GENERATE_LIMIT;
	}

	private long remainingLimitTime(String email, OtpType type) {
		return redisService.getLiveTime(otpLimitKey(email, type));
	}

}
