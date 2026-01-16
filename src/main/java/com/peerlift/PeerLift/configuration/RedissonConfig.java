package com.peerlift.PeerLift.configuration;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

	@Value("${redis.address:redis://127.0.0.1:6379}")
	private String redisAddress;

	@Value("${redis.password:}")
	private String redisPassword;

	@Bean(destroyMethod = "shutdown")
	public RedissonClient redissonClient() {
		Config config = new Config();
		config.useSingleServer()
			.setAddress(redisAddress);
		if (redisPassword != null && !redisPassword.isBlank()) {
			config.useSingleServer().setPassword(redisPassword);
		}
		return Redisson.create(config);
	}
}
