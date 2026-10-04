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



interface GridItemType {
  id: string;
  name: string;
  updatedAt: Date;
  icon?: string;
  image?: string;
  type: "websiteShortcut" | "folder";
  url?: string;
  nestedItems?: GridItemType[];
}

const db = new Dexie("ChatsDatabase") as Dexie & {
  chats: EntityTable<ChatType, "id">
  grid: EntityTable<GridItemType, "id">
}

db.version(1).stores({
  chats: "id, name",
  grid: "id, name, type, updatedAt"
})

export type { ChatType, GridItemType }
export { db }
