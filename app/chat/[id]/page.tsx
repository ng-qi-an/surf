'use client';
import ChatInput from "@/components/chat/ChatInput";
import getChat from "@/lib/actions/getChat";
import { ChatType } from "@/lib/db";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createChat } from "@shadcn/helpers/ai-sdk"
import { useChat } from "@ai-sdk/react"

const demoChat = createChat()
  .user("What changed in this release?")
  .assistant("The release adds keyboard shortcuts and faster search.")
  .user("Can you show me the shortcuts?")
  .assistant("Press ⌘K to search and ⌘Enter to submit.")
 
const initialMessages = demoChat.get(0)
const transport = demoChat.transport()
    

export default function ChatPage(){
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState<ChatType | null>(null);
    const [value, setValue] = useState("");
    const { id: chatId } = useParams();
    const { messages, setMessages, sendMessage, status } = useChat({
        messages: initialMessages,
        transport,
    })
    const nextMessage = demoChat.next(messages)
    const isBusy = status === "submitted" || status === "streaming"


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
        <motion.div layout="position" className="w-full max-w-192 py-6 h-full flex flex-col">
            <div className="w-full h-full">
                {messages.map((message)=>{
                    return <p>{message.role}: {message.parts.filter((p)=> p.type == "text").map((p) => p.text).join("")}</p>
                })}
            </div>
            <ChatInput 
                showExpandedChatInput={true}
                value={value}
                disabled={!nextMessage}
                loading={isBusy}
                onChange={(e)=> setValue(e.target.value)}
                onKeyDown={(e)=>{
                    if (e.key == "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (nextMessage && !isBusy) {
                            setValue("");
                            void sendMessage(nextMessage)
                        } else {
                            setMessages([])
                        }
                    }
                }}
                onSubmitClick={()=>{
                    if (nextMessage && !isBusy) {
                        setValue("");
                        void sendMessage(nextMessage)
                    } else {
                        setMessages([])
                    }
                }}
            />
        </motion.div>
    </div>
}