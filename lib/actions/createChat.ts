import { generateId } from "ai";
import { db } from "../db";

export default async function createChat(){
    const id =  await db.chats.add({
        id: generateId(),
        name: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return id;
}