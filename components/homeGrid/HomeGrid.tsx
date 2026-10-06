import { useEffect, useState } from "react";
import {DragDropProvider} from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import HomeGridCard from "./HomeGridCard";
import WebsiteShortcut from "./items/WebsiteShortcut";
import { db, GridItemType } from "@/lib/db";
import saveAllGridItems from "@/lib/actions/grid/saveAllGridItems";
import AddGridItemButton from "./AddGridItemButton";

export default function HomeGrid(){
    const [items, setItems] = useState<GridItemType[]>([]);
    useEffect(()=>{
        (async()=>{
            const fetchedItems = await db.grid.orderBy("position").toArray()
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
                    setItems((items) => {
                        const newItems = move(items, event);
                        (async()=>{
                            await saveAllGridItems(newItems)
                        })();
                        return newItems;
                    })
                }}
            >
                {items.map((item, index) => {
                    return <HomeGridCard key={item.id} id={`item-${item.id}`} index={index} items={items} setItems={setItems}>
                        {item.type == "websiteShortcut" && <WebsiteShortcut id={item.id} name={item.name} url={item.url} image={item.image} />}
                    </HomeGridCard>
                })}
            </DragDropProvider>
        </div>
        <AddGridItemButton items={items} setItems={setItems}/>
    </>
}
