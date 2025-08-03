class RateLimiter {
	private attempts = new Map<string, { count: number; resetTime: number }>();
	private throttleTime: number;
	private maxAttempts: number;

	/**
	 * @param {number} throttleTime Number of milliseconds too throttle a user for
	 * @param {Number} maxAttempts Number of attempts a user has
	 */
	constructor(throttleTime: number = 5 * 6 * 1000, maxAttempts: number = 5) {
		this.throttleTime = throttleTime;
		this.maxAttempts = maxAttempts;
	}

	isAllowed(id: string) {
		let currentTime = Date.now();
		let record = this.attempts.get(id);

		console.log(record);

		if (!record || record.resetTime < currentTime) {
			this.attempts.set(id, { count: 1, resetTime: Date.now() * this.throttleTime });
			return true;
		}

		if (record.count >= this.maxAttempts) {
			return false;
		}

		record.count++;
		return true;
	}
}

export const AuthRateLimiterSingleton = new RateLimiter();
