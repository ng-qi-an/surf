import { useGridCard } from "@/components/providers/grid-card-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import deleteGridItem from "@/lib/actions/grid/deleteGridItem";
import { Ellipsis, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function WebsiteShortcut({id, name, url, image}: {id: string, name: string, url?: string, image?: string}){
    const { isDragging, setEnableEffect, setItems } = useGridCard();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    useEffect(()=>{
        setEnableEffect(!dropdownOpen);
    }, [dropdownOpen])
    return <> 
        <div onClick={()=>{ url && (window.location.href = url)}} className={`relative w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-card ${isDragging ? "bg-card border border-dashed" : dropdownOpen && "bg-card"} group transition-all rounded-lg`}>
            {image ? <img src={image} className="w-10 h-10 rounded-lg"/> : <Globe className="size-10 text-muted-foreground"/>}
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
                    }}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={async(e)=>{
                        e.stopPropagation();
                        await deleteGridItem(name);
                    }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </>
}