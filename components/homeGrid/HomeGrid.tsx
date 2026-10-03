import { useEffect, useState } from "react";
import {DragDropProvider} from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import HomeGridCard from "./HomeGridCard";
import WebsiteShortcut from "./items/WebsiteShortcut";
import { GridItemType } from "@/lib/types";

export default function HomeGrid(){
    const defaultItems:GridItemType[] = [
        {
            id: "1",
            type: "websiteShortcut",
            name: "Slack",
            url: "https://slack.com",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png"
        },
        {
            id: "2",
            type: "websiteShortcut",
            name: "Slack",
            url: "https://slack.com",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png"
        },
        {
            id: "3",
            type: "websiteShortcut",
            name: "Slack",
            url: "https://slack.com",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png"
        },
        {
            id: "4",
            type: "websiteShortcut",
            name: "Slack",
            url: "https://slack.com",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png"
        },
    ]
    const [items, setItems] = useState(defaultItems);
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
                return <HomeGridCard key={item.id} id={`item-${item.id}`} index={index}>
                    {item.type == "websiteShortcut" && <WebsiteShortcut name="Slack" url="https://slack.com" image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/3840px-Slack_icon_2019.svg.png" />}
                </HomeGridCard>
            })}
        </DragDropProvider>
    </div>
}
