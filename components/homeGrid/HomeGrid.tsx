import { useEffect, useState } from "react";
import {DragDropProvider} from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import HomeGridCard from "./HomeGridCard";
import WebsiteShortcut from "./items/WebsiteShortcut";
import { db, GridItemType } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import addGridItem from "@/lib/actions/grid/addGridItem";

export default function HomeGrid(){
    const [items, setItems] = useState<GridItemType[]>([]);
    useEffect(()=>{
        (async()=>{
            const fetchedItems = await db.grid.toArray()
            setItems(fetchedItems)
        })();
    }, [])
    useEffect(()=>{
        console.log("items", items)
    }, [items])
    return <>
        <div className="grid grid-cols-3 gap-2 p-4 w-full">
            <DragDropProvider
                onDragEnd={(event)=>{
                    console.log(event.operation.source?.id)
                    setItems(items => move(items, event))
                }}
            >
                {items.map((item, index) => {
                    return <HomeGridCard key={item.id} id={`item-${item.id}`} index={index}>
                        {item.type == "websiteShortcut" && <WebsiteShortcut name="Slack" url="https://slack.com" image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png" />}
                    </HomeGridCard>
                })}
            </DragDropProvider>
        </div>
        <Button variant="ghost" className="fixed bottom-4 text-muted-foreground" size="xs" onClick={async()=>{
            await addGridItem({
                id: crypto.randomUUID(),
                updatedAt: new Date(),
                name: "New Item",
                type: "websiteShortcut",
                url: "",
                image: ""
            })
        }}><Plus/> Add item</Button>
    </>
}
