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

    return <div className="w-full relative h-9">
       {chat.id == chatId && <motion.div className={`w-full flex items-center rounded-xl px-1 py-2 h-9 bg-secondary cursor-pointer`} layoutId="chatListHighlight"/>}
        <motion.div onClick={()=> router.push(`/chat/${chat.id}`)} variants={item} className={`w-full top-0 left-0 absolute flex items-center rounded-xl px-1 py-2 group ${chat.id == chatId ? '' : 'hover:bg-card'} cursor-pointer`}>
            <div className="flex flex-col gap-1 px-2">
                <span className={`text-sm ${chat.id == chatId ? 'text-base' : 'text-muted-foreground group-hover:text-foreground'} transition-all`}>{chat.name}</span>
            </div>
        </motion.div>
    </div>
}