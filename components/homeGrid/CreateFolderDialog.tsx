import { Folder, Search, X } from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import { Button } from "../ui/button"
import { GridItemType } from "@/lib/db";
import { Input } from "../ui/input";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import SearchIconGrid from "./SearchIconGrid";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";

export default function CreateFolderDialog({setItems, setShowCreateFolder, showFolderIconPicker, setShowFolderIconPicker}:{setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>; setShowCreateFolder: React.Dispatch<React.SetStateAction<boolean>>; showFolderIconPicker: boolean; setShowFolderIconPicker: React.Dispatch<React.SetStateAction<boolean>>}){
    const [name, setName] = useState("")
    const [search, setSearch] = useState("")
    const [icon, setIcon] = useState("folder")
    const [color, setColor] = useState("default")
    const items = [
        { label: "Default", value: "default" },
        { label: "Red", value: "red" },
        { label: "Orange", value: "orange" },
        { label: "Green", value: "green" },
        { label: "Teal", value: "teal" },
        { label: "Blue", value: "blue" },
        { label: "Indigo", value: "indigo" },
        { label: "Purple", value: "purple" },
        { label: "Pink", value: "pink" },
    ]
    return <motion.div key="createFolderDialog" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="flex gap-2 relative">
            <AnimatePresence>
                {showFolderIconPicker && <>
                    <motion.div initial={{x: -70, y: -20, scale: 0.7, opacity: 0}} animate={{x: 0, y: 0, scale: 1, opacity: 1}} exit={{x: -70, scale: 0.7, opacity: 0, transition: {opacity: {duration: 0.1}}}} className="absolute overflow-hidden top-2 z-50 left-18 w-80 h-max rounded-xl bg-secondary p-3 flex flex-col">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center w-full gap-1">
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <Search/>
                                    </InputGroupAddon>
                                    <InputGroupInput autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search from ${iconNames.length} icons`}/>
                                    <InputGroupAddon align="inline-end">
                                    </InputGroupAddon>
                                </InputGroup>
                                <Button size="icon-sm" variant="ghost" onClick={()=> setShowFolderIconPicker(false)}>
                                    <X/>
                                </Button>
                            </div>
                            <SearchIconGrid
                                query={search}
                                selectedIcon={icon as IconName}
                                className="mt-3 w-full max-h-60 overflow-y-auto"
                                onSelect={(iconName) => {
                                    setIcon(iconName)
                                    setShowFolderIconPicker(false)
                                }}
                            />
                        </div>
                    </motion.div>
                    {/** expand dialog own background */}
                    <motion.div onClick={()=> setShowFolderIconPicker(false)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute top-0 left-0 z-40 h-full w-full bg-background/80"/>
                </>}
            </AnimatePresence>
            <motion.div onClick={()=> setShowFolderIconPicker(!showFolderIconPicker)} layoutId="addFolderButton" exit={{x: 100, opacity: 0, transition: {opacity: {duration: 0.1}}}} transition={{layout: {
                    type: "spring",
                    duration: 0.35,
                    bounce: 0.2,
                }}} 
                whileTap={{scale: 0.9, transition: {scale: {type: "spring",
                    duration: 0.35,
                    bounce: 0.2,
                }}}} 
                className={`absolute top-2 z-40 left-0 size-16 rounded-xl ${color == "default" ? "bg-secondary": `${color} bg-primary`} cursor-pointer flex items-center justify-center`}>
                {icon ? <DynamicIcon name={icon as IconName} /> : <Folder/>}
            </motion.div>
            <div className="w-16"/>
            <motion.form initial={{x: -50, y: -20, opacity: 0, scale: 0.8}} animate={{y: 0, x: 0, opacity: 1, scale: 1, transition: {delay: 0.06}}} exit={{y: 5, opacity: 0, scale: 0.9, transition: {opacity: {duration: 0.15}}}}  className="z-30 flex flex-col gap-1 bg-card p-4 rounded-xl"
                onSubmit={(e)=>{
                    e.preventDefault();
                    setShowCreateFolder(false)
                }}
            >
                <h2 className="mb-2 font-semibold">New Folder</h2>
                <label htmlFor="shortcutName" className="text-sm opacity-90 mb-1">What should we call it?</label>
                <Input required id="shortcutName" value={name} onChange={(e) => setName(e.target.value)} placeholder="New Folder" autoFocus className="w-80"/>
                <label htmlFor="shortcutName" className="text-sm opacity-90 mb-1 mt-2">Pick a color</label>
                <Select items={items} value={color} onValueChange={(value)=> setColor(value || "")}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={true}>
                        <SelectGroup>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    <div className={cn(`size-3 mt-1 rounded-full mr-2 ${item.value === "default" ? "bg-foreground" : `bg-primary`}`, item.value)}></div>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="flex gap-2 mt-4 justify-between w-full">
                    <Button type="button" variant="secondary" onClick={()=>{
                        setShowCreateFolder(false)
                    }}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
            </motion.form>
        </div>
    </motion.div>
}
