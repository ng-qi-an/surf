export default function WebsiteShortcut({name, url, image}: {name: string, url: string, image: string}){
    return <div onClick={()=>window.open(url, "_blank")} className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-card rounded-lg">
        <img src={image} className="w-10 h-10 rounded-lg"/>
        <span className="text-sm text-center">{name}</span>
    </div>
}