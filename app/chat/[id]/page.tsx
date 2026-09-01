'use client';
import ChatInput from "@/components/chat/ChatInput";
import getChat from "@/lib/actions/getChat";
import { ChatType } from "@/lib/db";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createChat } from "@shadcn/helpers/ai-sdk"
import { useChat } from "@ai-sdk/react"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Bubble, BubbleContent } from "@/components/ui/bubble";

const demoChat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
  )
  .sleep(1000)
  .assistant(
    "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
  )
  .user(
    "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top."
  )
  .sleep(1000)
  .assistant(
    "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container."
  )
  .user(
    "And if they've scrolled up to re-read an older answer? I don't want to yank them back down."
  )
  .sleep(1000)
  .assistant(
    "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not."
  )
  .user("Last one — does this work with assistive tech?")
  .sleep(1000)
  .assistant(
    '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.'
  )
 
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
        <div className="w-full max-w-192 py-6 h-full flex flex-col">
            <div className="w-full flex-1 min-h-0 pb-4">
                <MessageScrollerProvider>
                    <MessageScroller>
                        <MessageScrollerViewport>
                            <MessageScrollerContent>
                                {messages.map((message) => (
                                    <MessageScrollerItem
                                        key={message.id}
                                        messageId={message.id}
                                        scrollAnchor={message.role === "user"}
                                    >
                                        <Message align={message.role === "user" ? "end" : "start"}>
                                            <MessageContent>
                                                <Bubble variant={message.role === "user" ? "muted" : "ghost"}>
                                                    <BubbleContent>
                                                        {message.parts.filter((part) => part.type === "text").map((part)=> part.text).join("")}                                                    
                                                    </BubbleContent>
                                                </Bubble>

                                            </MessageContent>
                                        </Message>
                                    </MessageScrollerItem>
                                ))}
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                        <MessageScrollerButton />
                    </MessageScroller>
                </MessageScrollerProvider>
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
        </div>
        
    </div>
}