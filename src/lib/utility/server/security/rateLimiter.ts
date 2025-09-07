/**
 * Rate limiter class that tracks and limits the number of calls per identifier within a time period
 */
export class RateLimiter {
	private attempts = new Map<string, { count: number; resetTime: number }>();
	private readonly timePeriod: number;
	private readonly maxCalls: number;

	/**
	 * Creates a new RateLimiter instance
	 * @param timePeriod - Number of milliseconds for a time period (default: 30 seconds)
	 * @param maxCalls - Number of calls allowed in that time period (default: 5)
	 */
	constructor(timePeriod: number = 30 * 1000, maxCalls: number = 5) {
		this.timePeriod = timePeriod;
		this.maxCalls = maxCalls;
	}

	/**
	 * Checks if the given identifier is allowed to make a call based on rate limiting rules
	 * @param id - Unique identifier for the caller (e.g., IP address, user ID)
	 * @returns True if the call is allowed, false if rate limit exceeded
	 */
	isAllowed(id: string): boolean {
		const currentTime = Date.now();
		const record = this.attempts.get(id);

		if (!record || record.resetTime < currentTime) {
			this.attempts.set(id, { count: 1, resetTime: currentTime + this.timePeriod });
			return true;
		}

		if (record.count >= this.maxCalls) {
			return false;
		}

		record.count++;
		return true;
	}
}

const MINUTE_IN_MS = 60 * 1000;

/**
 * Rate limiter for authentication attempts (5 calls per 30 seconds)
 */
export const AuthRateLimiterSingleton = new RateLimiter();

/**
 * Rate limiter for registered user LLM calls (10 calls per minute)
 */
export const LLMCallRateLimiterSingleton = new RateLimiter(MINUTE_IN_MS, 10);

/**
 * Rate limiter for guest user LLM calls (5 calls per minute)
 */
export const LLMGuestCallRateLimiterSingleton = new RateLimiter(MINUTE_IN_MS, 5);
