import { AnimatePresence, motion } from "framer-motion";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";
import { Globe, ChevronDown } from "lucide-react";
import { ToolUIPart, UIMessage } from "ai";
import { Fragment, useState } from "react";
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentTitle, AttachmentTrigger } from "../ui/attachment";
export default function SearchResult({part, message, index}: {part: ToolUIPart, message: UIMessage, index: number}) {
    const [expanded, setExpanded] = useState(false);
    if (part.state == "input-streaming" || part.state == "input-available") {
        return <Marker key={message.id+index} variant="separator" role="status">
            <MarkerIcon>
                <Spinner />
            </MarkerIcon>
            <MarkerContent className="shimmer">Searching the web...</MarkerContent>
        </Marker>
    } else if (part.state == "output-available") {
        return <div className="flex flex-col"> 
            <Marker onClick={()=> setExpanded(!expanded)} key={message.id+index} variant="separator" className="hover:text-foreground" render={<button/>}>
                <MarkerIcon>
                    <Globe/>
                </MarkerIcon>
                <MarkerContent className="flex gap-1">Retrieved {(part.output as any).results.length || 0} results <ChevronDown className={`${expanded ? 'rotate-180' : ''} transition-all`}/></MarkerContent>
            </Marker>
            <AnimatePresence>
                {expanded && <motion.div key={message.id+index+"-expanded"} layout initial={{height: 0}} animate={{height: 72}} exit={{height: 0}} className="h-14 overflow-hidden flex flex-col">
                    <div className="h-4 shrink-0"/>
                    <AttachmentGroup className="gap-2 py-0 shrink-y-0">
                        {(part.output as { results: any[] }).results.map((result, idx)=> (
                            <Attachment key={idx} className="max-w-52 px-4 h-14 rounded-2xl">
                                <AttachmentContent>
                                    <AttachmentTitle>{result.title}</AttachmentTitle>
                                    <AttachmentDescription>{result.url}</AttachmentDescription>
                                </AttachmentContent>
                                <AttachmentTrigger onClick={()=> window.open(result.url, "_blank")}>
                                </AttachmentTrigger>
                            </Attachment>
                        ))}
                    </AttachmentGroup>
                </motion.div>}
            </AnimatePresence>
        </div>
    }
}