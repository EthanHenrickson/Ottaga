import type {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

//Overall database design
export interface Database {
    chat: ChatTable
    cookie: CookieTable
}

//Chat table used to manage chats
export interface ChatTable {
    id: ColumnType<string, string, never>
    FK_userID: string | null
    title: string | null
    description: string | null
    createdDate: ColumnType<number, number | undefined, never>
    modifiable: Generated<number>
    deleted: Generated<number>
}

export type Chat = Selectable<ChatTable>
export type NewChat = Insertable<ChatTable>
export type ChatUpdate = Updateable<ChatTable>



//Message table used to manage chats
export interface MessageTable {
    id: ColumnType<Generated<number>, never, never>
    FK_chatID: string
    role: string
    content: string
    createdDate: ColumnType<number, number, never>
    deleted: Generated<number>
}

export type Message = Selectable<MessageTable>
export type NewMessage = Insertable<MessageTable>
export type MessageUpdate = Updateable<MessageTable>


//Cookie table used to manage user sessions 
export interface CookieTable {
    id: string
    FK_userID: string
    expireTime: number
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
    details: string | null
    createdDate: ColumnType<number, number, never>
    deleted: Generated<number>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>


