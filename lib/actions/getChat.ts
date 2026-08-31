import { db } from "../db";

export default async function getChat(id: string){
    return await db.chats.get(id);
}