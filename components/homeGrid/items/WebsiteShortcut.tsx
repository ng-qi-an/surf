import { useGridCard } from "@/components/providers/grid-card-provider";

export default function WebsiteShortcut({name, url, image}: {name: string, url: string, image: string}){
    const { isDragging } = useGridCard();
    return <div onClick={()=>window.open(url, "_blank")} className={`w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-card ${isDragging && "bg-card border border-dashed"} transition-all rounded-lg`}>
        <img src={image} className="w-10 h-10 rounded-lg"/>
        <span className="text-sm text-center">{name}</span>
    </div>
}