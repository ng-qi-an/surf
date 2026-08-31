'use client';
import getChat from "@/lib/actions/getChat";
import { ChatType } from "@/lib/db";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function ChatPage(){
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState<ChatType | null>(null);
    const { id: chatId } = useParams();
    useEffect(()=>{
        (async()=>{
            if (!chatId) return;
            const chat = await getChat(chatId as string);
            if (!chat) {
                setLoading(false);
                return;
            }
            setChat(chat);
            setLoading(false);
        })();
    }, [])
    return <div className="w-full h-screen flex flex-col items-center px-4">
        <div className="w-full max-w-192 bg-black h-full">

        </div>
    </div>
}