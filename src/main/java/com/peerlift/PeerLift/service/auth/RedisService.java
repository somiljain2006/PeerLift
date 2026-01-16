package com.peerlift.PeerLift.service.auth;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Data
@Service
@RequiredArgsConstructor
public class RedisService {

	private final StringRedisTemplate redisTemplate;

	public void saveValue(String key, String value, long ttl) {
		redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(ttl));
	}

	public void deleteValue(String key) {
		redisTemplate.delete(key);
	}

	public String getValue(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	public boolean exists(String key) {
		return redisTemplate.hasKey(key);
	}

	public Long getLiveTime(String key) {
		Long liveTime = redisTemplate.getExpire(key, TimeUnit.SECONDS);
		if (liveTime < 0) {
			return 0L;
		}
		return liveTime;
	}

	public Long incrementValue(String key) {
		return redisTemplate.opsForValue().increment(key);
	}

	public void setExpiry(String key, long seconds) {
		redisTemplate.expire(key, Duration.ofSeconds(seconds));
	}

}
