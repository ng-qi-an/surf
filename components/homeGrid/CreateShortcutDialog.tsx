import { Globe, Image, SquareDashedPlus, Star, X } from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import { Button } from "../ui/button"
import { GridItemType } from "@/lib/db";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import ShortcutIcon from "./ShortcutIcon";
import IconTypePicker from "./IconTypePicker";

export default function CreateShortcutDialog({setItems, setShowCreateShortcut, expandIconDialog, setExpandIconDialog}:{setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>; setShowCreateShortcut: React.Dispatch<React.SetStateAction<boolean>>; expandIconDialog: boolean; setExpandIconDialog: React.Dispatch<React.SetStateAction<boolean>>}){
    const [name, setName] = useState("")
    const [website, setWebsite] = useState("")
    const [icon, setIcon] = useState("")
    const [iconType, setIconType] = useState<"url" | "image" | "icon">("url")
    const [websiteChangeTimeout, setWebsiteChangeTimeout] = useState<NodeJS.Timeout | null>(null)
    useEffect(()=>{
        if (website){
            if (websiteChangeTimeout) clearTimeout(websiteChangeTimeout)
            const timeout = setTimeout(()=>{
                try {
                    const websiteUrl = new URL(website)
                    setIcon(`https://a.favicon.im/${websiteUrl.hostname}?larger=true`)
                } catch (e){
                    setIcon("")
                }
            }, 500)
            setWebsiteChangeTimeout(timeout)
        } else {
            setIcon("")
        }
    }, [website])
    return <motion.div key="createShortcutDialog" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="flex gap-2 relative">
            {expandIconDialog ? 
            <>
                <motion.div layoutId="addShortcutButton" animate={{height: iconType == "url" ? 128 : 194, transition: {
                        height: {
                            type: "spring",
                            duration: 0.4,
                            bounce: 0.35,
                        }
                    }}} 
                    transition={{layout: {
                            type: "spring",
                            duration: 0.4,
                            bounce: 0.35,
                    }}} 
                    className="absolute overflow-hidden top-0 z-50 left-0 w-max h-max rounded-xl bg-secondary p-4 flex flex-col">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon-sm" className="absolute z-50 top-2 right-2" onClick={()=> setExpandIconDialog(false)}>
                            <X/>
                        </Button>
                        <motion.div layout className="size-20 shrink-0 bg-input/50 flex items-center justify-center rounded-xl">
                            <ShortcutIcon icon={icon} setIcon={setIcon} website={website}/>
                        </motion.div>
                        <motion.div className="flex flex-col w-full gap-1 ml-3">
                            <label className="text-sm opacity-90 mb-1">Icon type</label>
                            <IconTypePicker value={iconType} onChange={(value)=> setIconType(value as typeof iconType)} options={[
                                {label: "Website", icon: Globe, value: "url"},
                                {label: "Image", icon: Image, value: "image"},
                                {label: "Icon", icon: Star, value: "icon"},
                            ]}/>
                            <p className="text-center text-xs mt-0.5 text-muted-foreground">Choose other styles to explore options.</p>
                        </motion.div>
                    </div>
                    <AnimatePresence mode="wait">
                        {iconType == "image" ? <motion.div key="shortcutsImageUpload" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}}>
                            <label htmlFor="shortcutImageUpload" className="mt-2 text-sm opacity-90 mb-1">Upload image</label>
                            <Input required id="shortcutImageUpload" value={name} onChange={(e) => setName(e.target.value)} placeholder="New Shortcut" type="file" className="w-full mt-1"/>
                        </motion.div> : iconType == "icon" ? <motion.div key="shortcutsIconPicker" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}}>
                            <label htmlFor="shortcutImageUpload" className="mt-2 text-sm opacity-90 mb-1">Upload image</label>
                            <Input required id="shortcutImageUpload" value={name} onChange={(e) => setName(e.target.value)} placeholder="New Shortcut" type="file" className="w-full mt-1"/>
                        </motion.div> : null}
                    </AnimatePresence>
                </motion.div>
                {/** expand dialog own background */}
                <motion.div onClick={()=> setExpandIconDialog(false)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute top-0 left-0 z-40 h-full w-full bg-background/80"/>
            </>
            :
            <motion.div onClick={()=> setExpandIconDialog(true)} layoutId="addShortcutButton" exit={{x: 100, opacity: 0, transition: {opacity: {duration: 0.1}}}} transition={{layout: {
                    type: "spring",
                    duration: 0.35,
                    bounce: 0.2,
                }}} 
                whileTap={{scale: 0.9, transition: {scale: {type: "spring",
                    duration: 0.35,
                    bounce: 0.2,
                }}}} 
                className="absolute top-2 z-40 left-0 size-16 rounded-xl bg-secondary cursor-pointer flex items-center justify-center">
                <ShortcutIcon icon={icon} setIcon={setIcon} website={website}/>
            </motion.div>}
            <div className="w-16"/>
            <motion.form initial={{x: -50, y: -20, opacity: 0, scale: 0.8}} animate={{y: 0, x: 0, opacity: 1, scale: expandIconDialog ? 1 : 1, transition: {delay: 0.06}}} exit={{y: 5, opacity: 0, scale: 0.9, transition: {opacity: {duration: 0.15}}}}  className="z-30 flex flex-col gap-1 bg-card p-4 rounded-xl"
                onSubmit={(e)=>{
                    e.preventDefault();
                    setShowCreateShortcut(false)

                }}
            >
                <h2 className="mb-2 font-semibold">New Shortcut</h2>
                <label htmlFor="shortcutName" className="text-sm opacity-90 mb-1">What should we call it?</label>
                <Input required id="shortcutName" value={name} onChange={(e) => setName(e.target.value)} placeholder="New Shortcut" autoFocus className="w-80"/>
                <label htmlFor="shortcutUrl" className="mt-2 text-sm opacity-90">Where should it go?</label>
                <Input required id="shortcutUrl" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className="w-80 "/>
                <div className="flex gap-2 mt-4 justify-between w-full">
                    <Button type="button" variant="secondary" onClick={()=>{
                        setShowCreateShortcut(false)
                    }}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
            </motion.form>
        </div>
    </motion.div>
}