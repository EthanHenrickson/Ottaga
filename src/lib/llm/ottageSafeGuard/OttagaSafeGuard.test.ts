import { OttagaSafeGuardLLM } from '../Ottaga';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock OpenAI client
const mockCallCompletion = vi.fn();

/**
 * Tests error handling scenarios in message checking
 */
describe('Check user message', () => {
	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();

		// Mock the client
		// Ensure llmClient is defined before mocking
		// @ts-ignore - Replace the client with our mock
		OttagaSafeGuardLLM.llmProviderInstance.callCompletion = mockCallCompletion;
	});

	it("Should return with default values if it can't connect to API", async () => {
		mockCallCompletion.mockResolvedValue('');

		let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: 'user', content: 'Hi there' });
		expect(result).toStrictEqual({
			isMalicious: true,
			messageResponse: "Sorry that message couldn't be parsed. Please try again."
		});
	});

	it('Should have an error parsing and return with default values', async () => {
		const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);
		mockCallCompletion.mockResolvedValue({ success: true, data: '{' });

		let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: 'user', content: 'Hi there' });
		expect(result).toStrictEqual({
			isMalicious: true,
			messageResponse: "Sorry that message couldn't be parsed. Please try again."
		});
		expect(consoleMock).toHaveBeenCalledOnce();
	});

	it('Should parse malicious message', async () => {
		mockCallCompletion.mockResolvedValue({
			success: true,
			data: `{ "isMalicious": true, "messageResponse": "This is a bad message" }`
		});

		let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: 'user', content: 'Hi there' });
		expect(result).toStrictEqual({
			isMalicious: true,
			messageResponse: 'This is a bad message'
		});
	});

	it('Should parse non-malicious message', async () => {
		mockCallCompletion.mockResolvedValue({
			success: true,
			data: `{ "isMalicious": false, "messageResponse": "" }`
		});

		let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: 'user', content: 'Hi there' });
		expect(result).toStrictEqual({
			isMalicious: false,
			messageResponse: ''
		});
	});
});
