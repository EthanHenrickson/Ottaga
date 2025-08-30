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
	title?: string;
	description?: string;

	constructor(title?: string, description?: string) {
		this.title = title;
		this.description = description;
	}
}

export class UpdateChatDTO {
	id: string = '';
	title?: string;
	description?: string;

	constructor(id: string, title?: string, description?: string) {
		this.id = id;
		if (title !== undefined) this.title = title;
		if (description !== undefined) this.description = description;
	}
}

export class DeleteChatDTO {
	id: string = '';

	constructor(id: string) {
		this.id = id;
	}
}
