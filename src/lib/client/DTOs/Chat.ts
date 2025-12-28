import type { Chat } from '$lib/server/db/databaseTypes';

export class ChatDTO {
	id: string = '';
	title: string = '';
	description: string = '';
	created_at: Date = new Date();

	constructor(data: Chat) {
		this.id = data.id;
		this.title = data.title;
		this.description = data.description;
		this.created_at = data.created_at;
	}
}

export class CreateChatDTO {
	constructor(
		readonly title?: string,
		readonly description?: string,
		readonly created_at: Date = new Date()
	) {}
}

export class UpdateChatDTO {
	constructor(
		readonly id: string,
		readonly title?: string,
		readonly description?: string
	) {}
}
