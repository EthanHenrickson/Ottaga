export class RateLimiter {
	private attempts = new Map<string, { count: number; resetTime: number }>();
	private timePeriod: number;
	private maxCalls: number;

	/**
	 * @param {number} timePeriod Number of milliseconds for a time period
	 * @param {Number} maxCalls Number of calls a user can make in that time period
	 */
	constructor(timePeriod: number = 30 * 1000, maxCalls: number = 5) {
		this.timePeriod = timePeriod;
		this.maxCalls = maxCalls;
	}

	isAllowed(id: string) {
		const currentTime = Date.now();
		const record = this.attempts.get(id);

		if (!record || record.resetTime < currentTime) {
			this.attempts.set(id, { count: 1, resetTime: Date.now() + this.timePeriod });
			return true;
		}

		if (record.count >= this.maxCalls) {
			return false;
		}

		record.count++;
		return true;
	}
}

export const AuthRateLimiterSingleton = new RateLimiter();
export const LLMCallRateLimiterSingleton = new RateLimiter(60 * 1000, 6);
