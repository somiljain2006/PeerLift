package com.peerlift.PeerLift.service.Interface;

public interface IRateLimitService {

	boolean tryConsume(String key);

}

