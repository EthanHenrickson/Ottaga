/**
 * Tests for Ottaga's core LLM functionality
 * 
 * Verifies the main assistant's ability to:
 * - Create and manage chat sessions
 * - Handle message sending with proper safety checks
 * - Generate appropriate system prompts
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Ottaga } from './Ottaga';
import { ChatDatabase } from '$lib/db/chat';
import { LLMHelper } from '../helper/LLMHelper';
import type { Message } from '$lib/types';

/**
 * Mock database and helper services for isolated testing
 */
// Mock ChatDatabase
vi.mock('$lib/db/chat', () => ({
    ChatDatabase: {
        createChat: vi.fn(),
        addChatMessage: vi.fn(),
    }
}));

// Mock LLMHelper
vi.mock('../helper/LLMHelper', () => ({
    LLMHelper: {
        CheckUserMessage: vi.fn()
    }
}));

// Mock OpenAI client
const mockCreate = vi.fn();
const mockClient = {
    chat: {
        completions: {
            create: mockCreate
        }
    }
};

/**
 * Main test suite for Ottaga LLM functionality
 */
describe('OttagaLLM', () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Mock the client
        // @ts-ignore - Replace the client with our mock
        Ottaga.Client = mockClient;
    });

    /**
     * Tests for chat session creation functionality
     */
    describe('CreateChat', () => {
        it('should create a chat without user info', async () => {
            vi.mocked(ChatDatabase.createChat).mockResolvedValue({
                success: true,
                message: 'Chat created successfully',
                data: {uuid: 'test-chat-id'}
            });

            const OttagaResponse = await Ottaga.CreateChat();

            expect(ChatDatabase.createChat).toHaveBeenCalledWith(undefined);
            expect(ChatDatabase.addChatMessage).toHaveBeenCalledOnce();
            expect(OttagaResponse.chatID).toBe('test-chat-id');
        });

        it('should create a chat with user info and past sessions', async () => {
            vi.mocked(ChatDatabase.createChat).mockResolvedValue({
                success: true,
                message: 'Chat created successfully',
                data: {uuid: 'test-chat-id'}
            });

            const userInfo = {
                userID: 'test-user',
                pastSessionSummaries: ['Past session 1', 'Past session 2']
            };

            const OttagaResponse = await Ottaga.CreateChat(userInfo);

            expect(ChatDatabase.createChat).toHaveBeenCalledWith('test-user');
            expect(ChatDatabase.addChatMessage).toHaveBeenCalledWith(
                'test-chat-id',
                expect.objectContaining({
                    role: 'system',
                    content: expect.stringContaining('Past session 1')
                })
            );
            expect(OttagaResponse.chatID).toBe('test-chat-id');
        });

        it('should throw error when chat creation fails', async () => {
            vi.mocked(ChatDatabase.createChat).mockResolvedValue({
                success: false,
                message: 'Failed to create chat'
            });
            await expect((async () => { await Ottaga.CreateChat()})()).rejects.toThrow('Failed to create Chat for Ottaga');
        });
    });

    /**
     * Tests for message sending and safety handling
     */
    describe('SendMessage', () => {
        const pastMessages: Message[] = [
            { role: 'system', content: 'Test system prompt' },
            { role: 'user', content: 'Hello' }
        ];
        const newMessage: Message = { role: 'user', content: 'How are you?' };

        it('should handle non-malicious messages', async () => {
            // Mock LLMHelper to return non-malicious
            vi.mocked(LLMHelper.CheckUserMessage).mockResolvedValue({ isMalicious: false, messageResponse: "" });

            // Mock OpenAI response
            mockCreate.mockResolvedValue({
                choices: [{ message: { content: 'I am doing well!' } }]
            });

            const response = await Ottaga.SendMessage(pastMessages, newMessage);

            expect(LLMHelper.CheckUserMessage).toHaveBeenCalledWith(newMessage);
            expect(mockCreate).toHaveBeenCalledOnce();
            expect(response).toEqual({
                data: {
                    role: 'assistant',
                    content: 'I am doing well!'
                }
            });
        });

        it('should handle malicious messages', async () => {
            // Mock LLMHelper to return malicious
            vi.mocked(LLMHelper.CheckUserMessage).mockResolvedValue({
                isMalicious: true,
                messageResponse: 'This message was flagged as inappropriate'
            });

            const response = await Ottaga.SendMessage(pastMessages, newMessage);

            expect(LLMHelper.CheckUserMessage).toHaveBeenCalledWith(newMessage);
            expect(mockCreate).not.toHaveBeenCalled();
            expect(response).toEqual({
                data: {
                    role: 'assistant',
                    content: 'This message was flagged as inappropriate'
                }
            });
        });

        it('should handle empty LLM response', async () => {
            vi.mocked(LLMHelper.CheckUserMessage).mockResolvedValue({ isMalicious: false, messageResponse: "" });
            mockCreate.mockResolvedValue({
                choices: [{ message: { content: '' } }]
            });

            const response = await Ottaga.SendMessage(pastMessages, newMessage);

            expect(response).toEqual({
                data: {
                    role: 'assistant',
                    content: ''
                }
            });
        });
    });
});
