import { db } from "../../db";

export default function renameChat(chatId: string, newName: string){
    return db.chats.update(chatId, {
        name: newName,
        updatedAt: new Date(),
    });
}