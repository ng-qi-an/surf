'use client';
import ChatInput from "@/components/chat/ChatInput";
import getChat from "@/lib/actions/getChat";
import { ChatType } from "@/lib/db";
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
import { Streamdown } from "streamdown";
import { DefaultChatTransport, UIMessage } from "ai";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SearchResult from "@/components/chat/SearchResult";
import updateChatMessages from "@/lib/actions/updateChatMessages";
const demoChat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
  )
  .sleep(1000)
  .assistant(
    "# I feel you\n\nThat's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
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
 
const dummyInitialMessages = demoChat.get(0)
const dummyTransport = demoChat.transport()


export default function ChatPage(){
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState<ChatType | null>(null);
    const [value, setValue] = useState("");
    const { id: chatId } = useParams();
    const { messages, setMessages, sendMessage, status, stop } = useChat({
        messages: chat?.messages, // dummyInitialMessages,
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }), //dummyTransport,
        onFinish: ({messages}) => {
            updateChatMessages(chatId as string, messages)
        },
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
            setMessages(chat.messages)
            setLoading(false);
        })();
    }, [])
    return !loading && <div className="w-full h-screen flex flex-col items-center px-4">
        <div className="w-full max-w-192 py-6 pt-12 h-full flex flex-col">
            <div className="w-full flex-1 min-h-0 pb-8">
                <MessageScrollerProvider>
                    <MessageScroller>
                        <MessageScrollerViewport>
                            <MessageScrollerContent>
                                {messages.map((message, mIdx) => (
                                    <MessageScrollerItem
                                        key={message.id}
                                        messageId={message.id}
                                        scrollAnchor={message.role === "user"}
                                    >
                                        <Message align={message.role === "user" ? "end" : "start"}>
                                            <MessageContent>
                                                <Bubble variant={message.role === "user" ? "muted" : "ghost"} className={message.role == "assistant" ? "w-full" : ""}>
                                                    <BubbleContent className="flex flex-col gap-6 w-full">
                                                            {message.role == "user" ? 
                                                                message.parts.filter((part) => part.type === "text").map((part)=> part.text).join("")
                                                            : message.parts.map((part, index)=> {
                                                                if (part.type === "text") {
                                                                    return <Streamdown key={message.id+index} className="typeset-chat typeset w-full" animated isAnimating={mIdx == messages.length - 1 && index == message.parts.length - 1 && isBusy}>
                                                                            {part.text}
                                                                        </Streamdown>
                                                                } else if (part.type =="tool-webSearch"){
                                                                    return <SearchResult key={message.id+index} part={part} message={message} index={index}/>
                                                                }
                                                            })}
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
                disabled={status == "submitted"}
                loading={isBusy}
                showStop={status == "streaming"}
                onChange={(e)=> setValue(e.target.value)}
                onKeyDown={(e)=>{
                    if (e.key == "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isBusy && value) {
                            sendMessage({text: value});
                            setValue("");
                        }
                    }
                }}
                onSubmitClick={()=>{
                    if (isBusy) {
                        stop()
                    } else if (value && !isBusy) {
                        sendMessage({text: value});
                        setValue("");
                    }
                }}
            />
        </div>
        
    </div>
}