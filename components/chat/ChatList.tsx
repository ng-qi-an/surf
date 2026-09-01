'use client';

import { Fragment, useState } from "react";
import { AnimatePresence, motion, stagger } from "motion/react";
import { Button } from "../ui/button";
import { MessageCirclePlus, PanelLeft, PanelLeftOpen, PanelRight, PanelRightOpen } from "lucide-react";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import ChatListItem from "./ChatListItem";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

export default function ChatList(){
    const [showChatList, setShowChatList] = useState(false);
    const [hoverSidebarButton, setHoverSidebarButton] = useState(false);
    const chats = useLiveQuery(async() => (await db.chats.toArray()).toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    const router = useRouter();
    const pathname = usePathname();

    return <AnimatePresence>
        {!showChatList ? 
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{}} layoutId="toggleChatListContainer" key="toggleChatListContainer" className="absolute top-4 left-4 z-20">
                <Button onMouseOver={()=> setHoverSidebarButton(true)} onMouseLeave={()=> setHoverSidebarButton(false)} key="toggleChatListButton" variant="ghost" size="icon-sm" className="opacity-50 hover:opacity-100" onClick={()=>{setShowChatList(true); setHoverSidebarButton(false)}}>
                    {hoverSidebarButton ? <PanelLeftOpen/> : <PanelLeft/>}
                </Button>
            </motion.div>
        :
            <motion.div initial={{x: -250, width: 0}} animate={{x: 0, width: 250}} exit={{x: -250, width: 0}} transition={{type: "spring", stiffness: 400, damping: 33}}  key="chatListDesktop" className="shrink-0 overflow-hidden py-4 z-40 border-r h-screen bg-background">
                <div className="w-[250px]">
                <div className="flex items-center w-full justify-between px-4 pl-5 mb-3">
                    <h1 className="font-heading opacity-90 cursor-default">Chats</h1>
                    <Button onMouseOver={()=> setHoverSidebarButton(true)} onMouseLeave={()=> setHoverSidebarButton(false)}  key="toggleChatListButton" variant="ghost" size="icon-sm" className="opacity-90" onClick={()=>{setShowChatList(false); setHoverSidebarButton(false)}}>
                        {hoverSidebarButton ? <PanelRightOpen/> : <PanelRight/>}
                    </Button>
                </div>
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                    hidden: {},
                    show: {
                        transition: {
                            delayChildren: stagger(0.1)
                        }
                    }
                    }}
                    className="flex flex-col gap-1 px-2"
                >
                     <div className="w-full relative h-9">
                        {pathname == "/" && <motion.div className={`w-full flex items-center rounded-xl px-1 py-2 h-9 bg-secondary cursor-pointer`} layoutId="chatListHighlight"/>}
                        <motion.div onClick={()=> router.push(`/`)} className={`w-full top-0 left-0 absolute flex items-center rounded-xl px-3 py-2 group ${pathname == "/" ? '' : 'hover:bg-card'} cursor-pointer`}>
                            <MessageCirclePlus className={`size-4 ${pathname == "/" ? 'text-base' : 'text-muted-foreground'}`} />
                            <span className={`text-sm pl-2 ${pathname == "/" ? 'text-base' : 'text-muted-foreground'}`}>New chat</span>
                        </motion.div>
                    </div>
                    <Separator className="my-2"/>
                    {chats?.map((chat)=>{
                        return <ChatListItem key={chat.id} chat={chat}/>
                    })}
                </motion.div>
                </div>
            </motion.div>
        }
        <div key="chatListBackdrop" id="chatListBackdrop" className={`w-screen h-screen fixed top-0 left-0 bg-black/50 z-30 block lg:hidden ${showChatList ? 'pointer-events-all opacity-100' : 'pointer-events-none opacity-0'} transition-all`} onClick={()=>setShowChatList(false)}/>
        {showChatList && <Fragment >
            <motion.div key="chatListMobile" initial={{x: -300}} animate={{x: 0}} exit={{x: -300}} transition={{type: "spring", stiffness: 400, damping: 33}} className="fixed top-0 left-0 w-full max-w-[300px] z-40 h-screen p-4 lg:hidden">
                <div className="w-full h-full bg-background border rounded-xl">
                </div>
            </motion.div>
        </Fragment>
        }
    </AnimatePresence>
}
