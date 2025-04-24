import type {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'
import type { role } from './types'

//Overall database design
export interface Database {
    chat: ChatTable
    cookie: CookieTable
    message: MessageTable
    user: UserTable
}

//Chat table used to manage chats
export interface ChatTable {
    id: string
    FK_userID: string | null
    title: string | null
    description: string | null
    created_at: ColumnType<Date, never, never>
    modifiable: Generated<boolean>
    deleted: Generated<boolean>
}

export type Chat = Selectable<ChatTable>
export type NewChat = Insertable<ChatTable>
export type ChatUpdate = Updateable<ChatTable>



//Message table used to manage chats
export interface MessageTable {
    id: string
    FK_chatID: string
    role: role
    content: string
    created_at: ColumnType<Date, never, never>
    deleted: Generated<boolean>
}

export type Message = Selectable<MessageTable>
export type NewMessage = Insertable<MessageTable>
export type MessageUpdate = Updateable<MessageTable>


//Cookie table used to manage user sessions 
export interface CookieTable {
    id: string
    FK_userID: string
    expireTime: Date
}

export type Cookie = Selectable<CookieTable>
export type NewCookie = Insertable<CookieTable>
export type CookieUpdate = Updateable<CookieTable>


//User table used to manage users
export interface UserTable {
    id: string
    name: string | null
    email: string
    hashedPassword: string
    created_at: ColumnType<Date, never, never>
    deleted: Generated<boolean>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>


