import { Plus } from "lucide-react";
import { InputGroupButton } from "../ui/input-group";

export default function AddItemButton(){
    return <InputGroupButton variant="ghost" size="icon-sm">
        <Plus/>
    </InputGroupButton>
}