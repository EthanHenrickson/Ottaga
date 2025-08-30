import type { Role } from '$lib/types'
import type {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from 'kysely'


//Overall database design
export interface Database {
    chat: ChatTable
    cookie: CookieTable
    message: MessageTable
    user: UserTable
    user_settings: UserSettingsTable
}

//Chat table used to manage chats
export interface ChatTable {
    id: ColumnType<string, string, never>
    FK_userID: ColumnType<string | null, string | null, never>
    title: Generated<string>
    description: Generated<string>
    created_at: ColumnType<Date, never, never>
    modifiable: Generated<boolean>
}

export type Chat = Selectable<ChatTable>
export type CreateChat = Insertable<ChatTable>
export type UpdateChat = Updateable<ChatTable>



//Message table used to manage chats
export interface MessageTable {
    id: ColumnType<string, string, never>
    FK_chatID: ColumnType<string, string, never>
    role: Role
    content: string
    created_at: ColumnType<Date, never, never>
}

export type Message = Selectable<MessageTable>
export type CreateMessage = Insertable<MessageTable>
export type UpdateMessage = Updateable<MessageTable>


//Cookie table used to manage user sessions 
export interface CookieTable {
    id: ColumnType<string, string, never>
    FK_userID: ColumnType<string, string, never>
    expireTime: Date
}

export type Cookie = Selectable<CookieTable>
export type CreateCookie = Insertable<CookieTable>
export type UpdateCookie = Updateable<CookieTable>


//User table used to manage users
export interface UserTable {
    id: ColumnType<string, string, never>
    name: string
    email: string
    hashedPassword: string
    created_at: ColumnType<Date, never, never>
}

export type User = Selectable<UserTable>
export type CreateUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

//User Settings table used to manage user settings
export interface UserSettingsTable {
    FK_userID: ColumnType<string, string, never>
    theme: Generated<string>
    receiveCommunityDigest: Generated<boolean>
    simplifiedLanguage: Generated<boolean>
    reduceMotion: Generated<boolean>
    saveConversations: Generated<boolean>
}

export type UserSettings = Selectable<UserSettingsTable>
export type CreateUserSettings = Insertable<UserSettingsTable>
export type UpdateUserSettings = Updateable<UserSettingsTable>