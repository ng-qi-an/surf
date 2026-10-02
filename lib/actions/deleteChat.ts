import { db } from "../db";

export default function deleteChat(chatId: string){
    return db.chats.delete(chatId);
}