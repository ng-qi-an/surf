import { db } from "../db";

export default async function generateChatName({query, chatId}: {query: string, chatId: string}) {
    try {
        const res = await fetch("/api/chat/generate-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });
        if (!res.ok) {
            console.error("Failed to generate chat name:", res.status);
            return null;
        }
        const data = await res.json();
        await db.chats.update(chatId, {
            name: data.name,
            updatedAt: new Date(),
        });
        return data.name as string;
    } catch (error) {
        console.error("Error generating chat name:", error);
        return null;
    }
}
