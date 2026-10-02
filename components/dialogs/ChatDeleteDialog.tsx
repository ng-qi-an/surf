import { ChatType } from "@/lib/db";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";

export default function ChatDeleteDialog({chat, open, setOpen, onDelete}: {chat: ChatType, open: boolean, setOpen: (open: boolean) => void, onDelete: () => void}) {
    return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <DialogTitle>Delete "{chat.name}"?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete the chat and all its messages.</DialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" type="submit" onClick={onDelete}>
                Delete
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
}