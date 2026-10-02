'use client';
import { ChatAttachment } from "@/lib/types";
import { createContext, useContext, useState } from "react";


type ChatContextType = {
    input: string,
    setInput: (input: string) => void,
    attachments: ChatAttachment[],
    setAttachments: (attachments: ChatAttachment[]) => void,
    uploadingFiles: boolean,
    setUploadingFiles: (uploadingFiles: boolean) => void,
}

const ChatContext = createContext<ChatContextType>({} as any);
export const useChatContext = () => useContext(ChatContext);

export default function ChatProvider({children}: {children: React.ReactNode}) {
    const [input, setInput] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    return <ChatContext.Provider value={{input, setInput, attachments, setAttachments, uploadingFiles, setUploadingFiles}}>
        {children}
    </ChatContext.Provider>
}