import { RateLimiter } from '$lib/server/utility/security/rateLimiter';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Rate Limiter', () => {
	let rateLimiter: RateLimiter;

	describe('isAllowed method', () => {
		beforeEach(() => {
			vi.clearAllMocks();
			rateLimiter = new RateLimiter(5000, 3);
		});

		it('Should allow first attempt for new ID', () => {
			const result = rateLimiter.tryConsume('user1');
			expect(result).toBe(true);
		});

		it('Should deny attempts after exceeding max attempts', () => {
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);

			expect(rateLimiter.tryConsume('user1')).toBe(false);
			expect(rateLimiter.tryConsume('user1')).toBe(false);
		});

		it('Should track different IDs separately', () => {
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(false);

			expect(rateLimiter.tryConsume('user2')).toBe(true);
			expect(rateLimiter.tryConsume('user2')).toBe(true);
		});

		it('Should reset attempts after throttle time expires', () => {
			const mockDate = new Date('2024-01-01T00:00:00.000Z');
			vi.setSystemTime(mockDate);

			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(true);
			expect(rateLimiter.tryConsume('user1')).toBe(false);

			// Advance time past throttle period (5000ms)
			vi.setSystemTime(new Date(mockDate.getTime() + 6000));

			expect(rateLimiter.tryConsume('user1')).toBe(true);
		});
	});
});
