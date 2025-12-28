import type { Message } from '$lib/server/db/databaseTypes';
import type { ChatMessage, Role } from '$lib/types';

export class MessageDTO {
	id: string = '';
	FK_chatID: string = '';
	role: Role = 'user';
	content: string = '';
	created_at: Date = new Date();

	constructor(data: Message) {
		this.id = data.id;
		this.FK_chatID = data.FK_chatID;
		this.role = data.role;
		this.content = data.content;
		this.created_at = data.created_at;
	}

	ToChatMessage(): ChatMessage {
		return {
			role: this.role,
			content: this.content
		};
	}
}

export class CreateMessageDTO {
	constructor(
		readonly chatID: string,
		readonly role: Role = 'user',
		readonly content: string
	) {}
}

export class UpdateMessageDTO {
	constructor(
		readonly messageID: string,
		readonly role?: Role,
		readonly content?: string
	) {}
}