import { ChatType } from "@/lib/db";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
export default function ChatListItem({ chat }: { chat: ChatType }) {
    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }
    const {id: chatId} = useParams();
    const router = useRouter();

    return <motion.div onClick={()=> router.push(`/chat/${chat.id}`)} variants={item} className={`w-full flex items-center rounded-xl px-1 py-2 ${chat.id == chatId ? 'bg-secondary' : 'hover:bg-card'} cursor-pointer`}>
        <div className="flex flex-col gap-1 px-2">
            <span className={`text-sm ${chat.id == chatId ? 'text-base' : 'text-muted-foreground'}`}>{chat.name}</span>
        </div>
    </motion.div>
}