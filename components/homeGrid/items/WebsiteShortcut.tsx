import { useGridCard } from "@/components/providers/grid-card-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import deleteGridItem from "@/lib/actions/grid/deleteGridItem";
import { Ellipsis, Globe } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import EditShortcutDialog from "../EditShortcutDialog";

export default function WebsiteShortcut({id, name, url, icon, iconType}: {id: string, name: string, url?: string, icon: string | null, iconType: "url" | "image" | "icon"}){
    const { isDragging, setEnableEffect, setItems, setShowEditDialog } = useGridCard();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    useEffect(()=>{
        setEnableEffect(!dropdownOpen);
    }, [dropdownOpen])
    return <> 
        <div onClick={()=>{ url && (window.location.href = url)}} className={`relative w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-card ${isDragging ? "bg-card border border-dashed" : dropdownOpen && "bg-card"} group transition-all rounded-lg`}>
            {icon ? (iconType == "icon" ? <DynamicIcon name={icon as IconName} className="size-8" aria-hidden="true" /> : <img loading={"lazy"} width={32} height={32} src={icon} onError={(e)=> {console.log(e)}}/>) : <Globe/>}
            <span className="text-sm text-center">{name}</span>
            <DropdownMenu open={dropdownOpen} onOpenChange={(open)=> setDropdownOpen(open)}>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className={`absolute top-1 right-1 ${dropdownOpen ? "opacity-100" : "opacity-0"} group-hover:opacity-100`} onClick={(e)=>{
                    e.stopPropagation();
                }}>
                    <Ellipsis className="size-4"/>
                </Button>}/>
                <DropdownMenuContent side="right">
                    <DropdownMenuItem onClick={(e)=>{
                        e.stopPropagation();
                        setDropdownOpen(false);
                        setShowEditDialog(true);
                    }}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={async(e)=>{
                        e.stopPropagation();
                        setItems(await deleteGridItem(id));
                    }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </>
}