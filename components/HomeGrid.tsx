import { useEffect, useState } from "react";
import GridItem from "./GridItem"
import {DragDropProvider} from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';

export default function HomeGrid(){
    const [items, setItems] = useState([1, 2, 3, 4]);
    useEffect(()=>{
        console.log("items", items)
    }, [items])
    return <div className="grid grid-cols-3 gap-2 p-4 w-full">
        <DragDropProvider
            onDragEnd={(event)=>{
                console.log(event.operation.source?.id)
                setItems(items => move(items, event))
            }}
        >
            {items.map((item, index) => {
                return <GridItem key={item} id={`item-${item}`} index={index}/>
            })}
        </DragDropProvider>
    </div>
}