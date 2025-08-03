import type { Message } from "$lib/server/db/databaseTypes"
import type { ChatMessage, Role } from "$lib/types"

export class MessageDTO {
    id: string = ""
    FK_chatID: string = ""
    role: Role = "user"
    content: string = ""
    created_at: Date = new Date()

    constructor(data: Message) {
        this.id = data.id
        this.FK_chatID = data.FK_chatID
        this.role = data.role
        this.content = data.content
        this.created_at = data.created_at
    }

    ToChatMessage(): ChatMessage {
        return {
            role: this.role,
            content: this.content
        }
    }
}

export class CreateMessageDTO {
    chatID: string = ""
    role: Role = "user"
    content: string = ""

    constructor(chatID: string, role: Role, content: string) {
        this.chatID = chatID
        this.role = role
        this.content = content
    }
}

export class UpdateMessageDTO {
    messageID: string
    role?: Role
    content?: string

    constructor( messageID: string, role?: Role, content?: string ) {
        this.messageID = messageID
        if (role !== undefined) this.role = role
        if (content !== undefined) this.content = content
    }
}

export class DeleteMessageDTO {
    id: string = ""

    constructor(id: string) {
        this.id = id
    }
}