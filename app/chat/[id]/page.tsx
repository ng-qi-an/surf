'use client';
import ChatInput from "@/components/chat/ChatInput";
import getChat from "@/lib/actions/getChat";
import { ChatType } from "@/lib/db";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createChat } from "@shadcn/helpers/ai-sdk"
import { useChat } from "@ai-sdk/react"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"
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
import { DefaultChatTransport, FileUIPart, UIMessage } from "ai";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";
import { Check, ChevronDown, Copy, ExternalLink, FileIcon, Globe, Info, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SearchResult from "@/components/chat/SearchResult";
import updateChatMessages from "@/lib/actions/updateChatMessages";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import generateChatName from "@/lib/actions/generateChatName";
import SoftAurora from "@/components/backgrounds/SoftAurora";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useChatContext } from "@/components/providers/chat-provider";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { allowedFileTypes, mimeToReadable } from "@/lib/types";
import { useTheme } from "next-themes";
import MicroSlats from "@/components/MicroSlats";
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
    const {input, setInput, attachments, setAttachments, uploadingFiles} = useChatContext();
    const { id: chatId } = useParams();
    const router = useRouter();
    const { messages, setMessages, sendMessage, status, stop, regenerate } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }), //dummyTransport,
        onFinish: ({messages}) => {
            updateChatMessages(chatId as string, messages)
        },
    })
    const nextMessage = demoChat.next(messages)
    const isBusy = status === "submitted" || status === "streaming"
    const params = useSearchParams()
    const [copied, setCopied] = useState(false);

    useEffect(()=>{
        (async()=>{
            if (!chatId) return;
            const chat = await getChat(chatId as string);
            if (!chat) {
                setLoading(false);
                return;
            }
            setChat(chat);
            console.log("Loaded chat:", chat);
            setMessages(chat.messages);
            if (params.get("newChat") && (input || attachments.length > 0)) {
                router.replace(`/chat/${chatId}`, { scroll: false });
                onInputSubmit(input);
                generateChatName({query: input || "New Chat", chatId: chatId as string});
            }
            setLoading(false);
        })();
    }, [])
    function onInputSubmit(query: string) {
        if (uploadingFiles || (!query.trim() && attachments.length == 0)) return;
        const fileList: FileUIPart[] = attachments.map((attachment) => ({
            type: "file",
            filename: attachment.fileName,
            mediaType: attachment.contentType,
            url: attachment.url,
        }));
        sendMessage({text: query, files: fileList});
        setInput("");
        setAttachments([]);
    }
    const { resolvedTheme } = useTheme();
    return !loading && <div className="w-full h-screen flex flex-col max-h-screen! overflow-hidden items-center px-4 relative">
        <AnimatePresence mode="wait">
            {isBusy && (resolvedTheme == "dark" ? <motion.div key="darkChatBackground" initial={{bottom: "-500px"}} animate={{bottom:"-250px"}} exit={{bottom: "-500px"}} transition={{duration: 0.3, delay: 0.2}} className="absolute h-[500px] -bottom-[250px] w-screen -z-10 blur-lg opacity-50 pointer-events-none">
                <SoftAurora 
                    speed={1.9}
                    scale={1.5}
                    brightness={1}
                    color1="#f7f7f7"
                    color2="#2563eb"
                    noiseFrequency={2}
                    noiseAmplitude={1}
                    bandHeight={0.5}
                    bandSpread={1}
                    octaveDecay={0.1}
                    layerOffset={0.25}
                    colorSpeed={1.6}
                    enableMouseInteraction={false}
                />
            </motion.div>
            : <motion.div key={"lightChatBackground"} initial={{opacity: 0}} animate={{opacity: status == "streaming" ? 0.25 : 0.7}} exit={{opacity: 0}} transition={{duration: 0.3, delay: 0.2}} className="absolute h-screen w-screen -z-10 pointer-events-none">
                <MicroSlats
                    color={resolvedTheme == "light" ? "#fff" : "var(--background)"}
                    glintColor={resolvedTheme == "light" ? "#93c5fd" : "#172554"}
                    backgroundColor={resolvedTheme == "light" ? "#fff" : "var(--background)"}
                    slatWidth={17}
                    slatHeight={19}
                    gap={4}
                    roundness={0.45}
                    speed={2}
                    scale={1.1}
                    direction={230}
                    chop={0}
                    stretch={0.95}
                    glint={0.65}
                    contrast={1.3}
                    perspective={0.5}
                    fog={0.45}
                    interactive={false}
                    cursorStrength={1}
                    cursorSize={40}
                    swirl={0.2}
                    trail={1.2}
                    lean={0}
                    intro={false}
                    introDuration={2}
                    paused={false}
                    className="dark:opacity-70"
                />
            </motion.div>)}
        </AnimatePresence>
        <div className="w-full max-w-192 pb-6 pt-2 h-full flex flex-col">
            <div className="absolute bottom-4 right-4 z-10 opacity-50 hover:opacity-100 overflow-auto">
                <ThemeToggle className=""/>
              </div>
            <div className="w-full flex-1 min-h-0 pb-8">
                <MessageScrollerProvider autoScroll defaultScrollPosition="end">
                    <MessageScroller>
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="pt-10">
                                {messages.map((message, mIdx) => (
                                    <MessageScrollerItem
                                        key={message.id}
                                        messageId={message.id}
                                        scrollAnchor={message.role === "user"}
                                    >
                                        <Message align={message.role === "user" ? "end" : "start"}>
                                            <MessageContent>
                                                {/* add attachments here later */}
                                                {message.role == "user" && message.parts.filter((part) => part.type === "file").map((part, index)=> {
                                                    return <Attachment key={(part as FileUIPart).url}>
                                                        <AttachmentMedia variant={allowedFileTypes.images.includes((part as FileUIPart).mediaType) ? "image" : "icon"}>
                                                            {allowedFileTypes.images.includes((part as FileUIPart).mediaType) ?
                                                                <img src={(part as FileUIPart).url}/>
                                                            : <FileIcon className="size-4"/>}
                                                        </AttachmentMedia>
                                                        <AttachmentContent>
                                                            <AttachmentTitle>{(part as FileUIPart).filename}</AttachmentTitle>
                                                            <AttachmentDescription>{mimeToReadable((part as FileUIPart).mediaType)}</AttachmentDescription>
                                                        </AttachmentContent>
                                                        <AttachmentActions>
                                                            <AttachmentAction onClick={()=> window.open((part as FileUIPart).url, "_blank")}>
                                                                <ExternalLink className="size-4"/>
                                                            </AttachmentAction>
                                                        </AttachmentActions>
                                                    </Attachment>
                                                })}
                                                <Bubble variant={message.role === "user" ? "muted" : "ghost"} className={message.role == "assistant" ? "w-full" : ""}>
                                                    <BubbleContent className="flex flex-col gap-6 w-full">
                                                            {message.role == "user" ? 
                                                                message.parts.filter((part) => part.type === "text").map((part)=> part.text).join("")
                                                            : message.parts.map((part, index)=> {
                                                                if (part.type === "text") {
                                                                    return <Streamdown key={message.id+index} className="typeset-chat typeset w-full" animated isAnimating={mIdx == messages.length - 1 && index == message.parts.length - 1 && isBusy}>
                                                                            {part.text}
                                                                        </Streamdown>
                                                                } else if (part.type =="tool-searchWeb"){
                                                                    return <SearchResult key={message.id+index} part={part} message={message} index={index}/>
                                                                }
                                                            })}
                                                    </BubbleContent>
                                                </Bubble>
                                                {message.role == "assistant" && <MessageFooter className={`gap-1 flex opacity-0 ${mIdx == messages.length - 1 ? isBusy ? "" : "opacity-100" : "hover:opacity-100"} transition-all`}>
                                                    <Tooltip>
                                                        <TooltipTrigger render={<span/>}>
                                                            <Button variant="ghost" size="icon-sm" onClick={()=>{
                                                                navigator.clipboard.writeText(message.parts.filter((part) => part.type === "text").map((part)=> part.text).join(""))
                                                                setCopied(true);
                                                                setTimeout(()=> setCopied(false), 2000)
                                                            }}>
                                                                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copy to Clipboard</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger render={<span/>}>
                                                            <Button variant="ghost" size="icon-sm">
                                                                <Info className="size-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Used: Deepseek V4.1 Flash</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {mIdx == messages.length - 1 && <Tooltip>
                                                        <TooltipTrigger render={<span/>}>
                                                            <Button onClick={()=> regenerate()} variant="ghost" size="icon-sm">
                                                                <RefreshCcw className="size-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Regenerate response</p>
                                                        </TooltipContent>
                                                    </Tooltip>}
                                                </MessageFooter>}
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
                showChatWhenCollapsed={false}
                disabled={status == "submitted"}
                loading={isBusy}
                showStop={status == "streaming"}
                onChange={(e)=> setInput(e.target.value)}
                onKeyDown={(e)=>{
                    if (e.key == "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isBusy && input) {
                            onInputSubmit(input);
                        }
                    }
                }}
                onSubmitClick={()=>{
                    if (isBusy) {
                        stop()
                    } else if (input && !isBusy) {
                        onInputSubmit(input);
                    }
                }}
            />
        </div>
        
    </div>
}