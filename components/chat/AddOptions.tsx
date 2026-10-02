import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { InputGroupButton } from "../ui/input-group";
import { useRef } from "react";
import uploadFiles from "@/lib/actions/uploadFiles";
import { toast } from "../ui/toast";
import { allowedFileTypesList, ChatAttachment } from "@/lib/types";
import { useChatContext } from "../providers/chat-provider";

export default function AddOptions() {
    const {attachments, setAttachments, uploadingFiles, setUploadingFiles} = useChatContext();
    const attachmentInput = useRef<HTMLInputElement | null>(null);
    const attachmentForm = useRef<HTMLFormElement | null>(null);
    async function submitForm(form: HTMLFormElement) {
        console.log("Submitting form with files:", form);
        setUploadingFiles(true);
        const formData = new FormData(form);
        setAttachments([...attachments, 
            ...Array.from(formData.getAll("files[]")).map(file => ({
                fileName: (file as File).name,
                status: "uploading" as const,
                size: (file as File).size,
                contentType: (file as File).type,
                url:  "",
                createdAt: new Date()
            }))
        ]);
        try {
            const data = await uploadFiles(formData)
            setAttachments(attachments.filter((attachment) => attachment.status == "uploaded"));
            setAttachments([...attachments, ...data.files.map((file: any) => ({
                fileName: file.fileName,
                status: file.status == "uploaded" ? "uploaded" : "failed" as const,
                size: file.size,
                contentType: file.contentType,
                url: file.url,
                createdAt: new Date(file.createdAt)
            }))]);
            console.log("Uploaded files:", data.files);
        } catch (error) {
            console.error("Error uploading files:", error);
            toast.add({
                title: "Error uploading files",
                description: "There was an error uploading your files. Please try again.",
                type: "error"
            })
        }
        setUploadingFiles(false);
    }
    return <>
        <form ref={attachmentForm} onSubmit={async(e) => {
            e.preventDefault();
            await submitForm(e.target);
        }}>
            <input accept={allowedFileTypesList.join(",")} disabled={uploadingFiles} type="file" name="files[]" ref={attachmentInput} style={{display: "none"}} onChange={async (e) => {
                if(e.target.files && e.target.files.length > 0){
                    if (!uploadingFiles) {
                        await submitForm(attachmentForm.current!);
                    }
                    if (attachmentInput.current){
                        attachmentInput.current.value = "";
                    }
                }
            }}/>
        </form>
        <DropdownMenu>
            <DropdownMenuTrigger render={<InputGroupButton variant="ghost" size="icon-sm"/>} >
                    <Plus/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={()=> attachmentInput.current?.click()} disabled={uploadingFiles}>
                    Upload File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}