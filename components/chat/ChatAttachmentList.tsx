import { File, X } from "lucide-react";
import { useChatContext } from "../providers/chat-provider";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "../ui/attachment";
import { Spinner } from "../ui/spinner";
import deleteFile from "@/lib/actions/deleteFile";
import { toast } from "../ui/toast";
import { allowedFileTypes, mimeToReadable } from "@/lib/types";

export default function ChatAttachmentList() {
    const {attachments, setAttachments} = useChatContext();
    return <AttachmentGroup>
        {attachments.map((attachment, index) => {
            return <Attachment state={attachment.status == "uploading" ? "uploading" : attachment.status == "failed" ? "error" : "done"} key={attachment.url}>
                <AttachmentMedia variant={allowedFileTypes.images.includes(attachment.contentType) ? "image" : "icon"}>
                    {attachment.status == "uploading" ? <Spinner className="size-4"/> : allowedFileTypes.images.includes(attachment.contentType) ?
                    <img src={attachment.url}/>
                    : 
                    <File className="size-4"/>}
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>{attachment.fileName}</AttachmentTitle>
                    <AttachmentDescription>{mimeToReadable(attachment.contentType)} | {(attachment.size / 1024).toFixed(2)} KB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                    <AttachmentAction disabled={attachment.status == "uploading"} onClick={async () => {
                        if (attachment.status == "uploading") return;
                        if (attachment.status == "uploaded"){
                            try {
                                await deleteFile(attachment.url);
                            } catch (error) {
                                console.error("Error deleting file:", error);
                                return toast.add({
                                    title: "Error deleting file",
                                    description: "There was an error deleting your file. Please try again.",
                                    type: "error"
                                })
                            }
                        }
                        setAttachments(attachments.filter((file) => file.url !== attachment.url));
                    }}>
                        <X/>
                    </AttachmentAction>
                </AttachmentActions>
            </Attachment>
        })}
    </AttachmentGroup>
}