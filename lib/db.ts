// db.ts
import { UIMessage } from "ai"
import { Dexie, type EntityTable } from "dexie"

interface ChatType {
    id: string
    name: string
    messages: Array<UIMessage>
    createdAt: Date
    updatedAt: Date
}

const db = new Dexie("ChatsDatabase") as Dexie & {
  chats: EntityTable<ChatType, "id">
}

db.version(1).stores({
  chats: "id, name",
})

export type { ChatType }
export { db }
