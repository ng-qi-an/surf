import { ChatType } from "@/lib/db";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ChatRenameDialog from "../dialogs/ChatRenameDIalog";
import { useState } from "react";
import renameChat from "@/lib/actions/renameChat";
import ChatDeleteDialog from "../dialogs/ChatDeleteDialog";
import deleteChat from "@/lib/actions/deleteChat";
export default function ChatListItem({ chat }: { chat: ChatType }) {
    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }
    const {id: chatId} = useParams();
    const router = useRouter();
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return <div className="w-full relative h-9">
        <ChatRenameDialog open={renameOpen} setOpen={setRenameOpen} chat={chat} onRename={(newName)=>{
            setRenameOpen(false);
            renameChat(chat.id, newName);
        }}/>
        <ChatDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} chat={chat} onDelete={()=>{
            setDeleteOpen(false);
            deleteChat(chat.id);
            router.push('/');
        }}/>
        {chat.id == chatId && <motion.div className={`w-full flex items-center rounded-xl px-1 h-9 bg-secondary cursor-pointer`} layoutId="chatListHighlight"/>}
        <motion.div onClick={()=> router.push(`/chat/${chat.id}`)} variants={item} className={`w-full top-0 left-0 absolute flex items-center rounded-xl px-1 group ${chat.id == chatId ? '' : 'hover:bg-card'} cursor-pointer`}>
            <div className="flex flex-col gap-1 px-2 py-2">
                <span className={`text-sm ${chat.id == chatId ? 'text-base' : 'text-muted-foreground group-hover:text-foreground'} transition-all line-clamp-1`}>{chat.name}</span>
            </div>
            <DropdownMenu>
                <Tooltip>
                        <TooltipTrigger render={<DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" className="ml-auto group-hover:opacity-100 opacity-0 hover:bg-transparent!" onClick={(e)=>{
                            e.stopPropagation();
                        }}/>} />}>
                            <Ellipsis className="size-4"/>
                        </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>More options</p>
                    </TooltipContent>
                </Tooltip>
            <DropdownMenuContent side="right">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Chat options</DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={(e)=>{
                        e.stopPropagation();
                        setRenameOpen(true);
                    }}>Rename</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e)=>{
                        e.stopPropagation();
                        setDeleteOpen(true);
                    }} variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        </motion.div>

    </div>
}