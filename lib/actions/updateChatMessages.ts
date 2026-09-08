import { db } from "../db";

export default async function updateChatMessages(id: string, messages: any[]){
    const newId = await db.chats.update(id, {
        messages: messages,
        updatedAt: new Date(),
    });
    return newId;
}