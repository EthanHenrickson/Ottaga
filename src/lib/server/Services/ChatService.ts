import {
	ChatDatabaseRepository,
	type IChatRepository
} from '$lib/server/db/Repository/ChatRepository';
import {
	MessageDatabaseRepository,
	type IMessageRepository
} from '$lib/server/db/Repository/MessageRepository';
import type { ServiceResult } from '$lib/types';
import { v4, v7 } from 'uuid';
import { ChatDTO, CreateChatDTO, UpdateChatDTO } from '../../client/DTOs/Chat';
import { MessageDTO, type CreateMessageDTO } from '../../client/DTOs/Message';
import type { CreateChat, CreateMessage } from '$lib/server/db/databaseTypes';

/**
 * Interface defining chat service operations for managing chats and messages
 */
interface IChatService {
	/**
	 * Creates a new chat
	 * @param userID - The user ID or null for anonymous users
	 * @param createChatDTO - Chat creation data
	 * @returns Promise resolving to service result with chat ID
	 */
	CreateChat(
		userID: string | null,
		createChatDTO: CreateChatDTO
	): Promise<ServiceResult<{ id: string }>>;

	/**
	 * Updates an existing chat by ID
	 * @param userID - The user ID or null for anonymous users
	 * @param chatData - Chat update data including ID
	 * @returns Promise resolving to service result
	 */
	UpdateChatByID(userID: string | null, chatData: UpdateChatDTO): Promise<ServiceResult>;

	/**
	 * Retrieves a chat by ID
	 * @param userID - The user ID or null for anonymous users
	 * @param chatID - The chat ID to retrieve
	 * @returns Promise resolving to service result with chat data
	 */
	GetChatByID(userID: string | null, chatID: string): Promise<ServiceResult<ChatDTO>>;

	/**
	 * Deletes a chat by ID
	 * @param userID - The user ID
	 * @param chatID - The chat ID to delete
	 * @returns Promise resolving to service result with deleted chat data
	 */
	DeleteChatByID(userID: string, chatID: string): Promise<ServiceResult<ChatDTO>>;

	/**
	 * Creates a new message in a chat
	 * @param userID - The user ID
	 * @param data - Message creation data
	 * @returns Promise resolving to service result with message ID
	 */
	CreateChatMessage(userID: string, data: CreateMessageDTO): Promise<ServiceResult<{ id: string }>>;

	/**
	 * Retrieves messages for a specific chat
	 * @param userID - The user ID
	 * @param chatID - The chat ID to get messages for
	 * @param rowLimit - Maximum number of messages to retrieve
	 * @returns Promise resolving to service result with messages array
	 */
	GetChatMessagesByID(
		userID: string,
		chatID: string,
		rowLimit: number
	): Promise<ServiceResult<{ messages: MessageDTO[] }>>;
}

class ChatService implements IChatService {
	private ChatRepository: IChatRepository;
	private MessageRepository: IMessageRepository;

	constructor(ChatRepository: IChatRepository, MessageRepository: IMessageRepository) {
		this.ChatRepository = ChatRepository;
		this.MessageRepository = MessageRepository;
	}

	async CreateChat(
		userID: string | null,
		createChatDTO: CreateChatDTO
	): Promise<ServiceResult<{ id: string }>> {
		const uuid = v4();
		const dbValues: CreateChat = {
			id: uuid,
			FK_userID: userID,
			...createChatDTO
		};
		const dbResponse = await this.ChatRepository.Create(dbValues);
		if (dbResponse.success) {
			return {
				success: true,
				data: { id: uuid }
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}

	async UpdateChatByID(userID: string | null, chatData: UpdateChatDTO): Promise<ServiceResult> {
		const existingChat = await this.ChatRepository.GetByID(chatData.id);
		if (existingChat.success) {
			if (existingChat.data.FK_userID !== userID) {
				return {
					success: false,
					message: 'Not adequate permission'
				};
			}
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		const dbResponse = await this.ChatRepository.Update(chatData.id, chatData);

		if (dbResponse.success) {
			return {
				success: true
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}

	async GetChatByID(userID: string | null, chatID: string): Promise<ServiceResult<ChatDTO>> {
		const dbResponse = await this.ChatRepository.GetByID(chatID);
		if (dbResponse.success) {
			if (dbResponse.data.FK_userID !== userID) {
				return {
					success: false,
					message: 'Not adequate permission'
				};
			}
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		return {
			success: true,
			data: new ChatDTO(dbResponse.data)
		};
	}

	async DeleteChatByID(userID: string, chatID: string): Promise<ServiceResult<ChatDTO>> {
		const existingUser = await this.ChatRepository.GetByID(chatID);

		if (existingUser.success) {
			if (existingUser.data.FK_userID !== userID) {
				return {
					success: false,
					message: 'Not adequate permission'
				};
			}
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		const dbResponse = await this.ChatRepository.Delete(chatID);

		if (dbResponse.success) {
			return {
				success: true
			};
		} else {
			return {
				success: false,
				message: 'Trouble deleting chat'
			};
		}
	}

	async CreateChatMessage(
		userID: string | null,
		data: CreateMessageDTO
	): Promise<ServiceResult<{ id: string }>> {
		const existingChat = await this.ChatRepository.GetByID(data.chatID);
		if (existingChat.success) {
			if (existingChat.data.FK_userID !== userID) {
				return {
					success: false,
					message: 'Not adequate permission'
				};
			}
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		const uuid = v7();
		const dbValues: CreateMessage = {
			id: uuid,
			FK_chatID: data.chatID,
			role: data.role,
			content: data.content
		};

		const dbResponse = await this.MessageRepository.Create(dbValues);

		if (dbResponse.success) {
			return {
				success: true,
				data: { id: uuid }
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}

	async GetChatMessagesByID(
		userID: string | null,
		chatID: string,
		rowLimit: number = 10
	): Promise<ServiceResult<{ messages: MessageDTO[] }>> {
		const existingChat = await this.ChatRepository.GetByID(chatID);
		if (existingChat.success) {
			if (existingChat.data.FK_userID !== userID) {
				return {
					success: false,
					message: 'Not adequate permission'
				};
			}
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}

		const dbResponse = await this.MessageRepository.GetMessagesByID(chatID, rowLimit);

		if (dbResponse.success) {
			const returnData: MessageDTO[] = [];
			dbResponse.data.forEach((element) => {
				returnData.push(new MessageDTO(element));
			});

			return {
				success: true,
				data: { messages: returnData }
			};
		} else {
			return {
				success: false,
				message: 'There was an error in processing'
			};
		}
	}
}

export const ChatServiceSingleton = new ChatService(
	ChatDatabaseRepository,
	MessageDatabaseRepository
);
