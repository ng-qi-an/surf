import { ChatType } from "@/lib/db";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ChatRenameDialog({chat, open, setOpen, onRename}: {chat: ChatType, open: boolean, setOpen: (open: boolean) => void, onRename: (newName: string) => void}) {
    const [name, setName] = useState(chat.name);
    return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Rename "{chat.name}"</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e)=>{
            e.preventDefault();
            onRename(name);
        }}>
            <Input placeholder="New name" value={name} required onChange={(e) => setName(e.target.value)}/>
            <DialogFooter className="mt-4">
                <DialogClose render={<Button variant="outline"/>}>
                    Cancel
                </DialogClose>
                <Button type="submit">Submit</Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>
}