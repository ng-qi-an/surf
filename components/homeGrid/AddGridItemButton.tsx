import { GridItemType } from "@/lib/db"
import { Button } from "../ui/button"
import addGridItem from "@/lib/actions/grid/addGridItem"
import { toast } from "../ui/toast"
import { ChevronDown, FolderPlus, Plus, Square, SquareDashedPlus, SquarePlus } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion, stagger } from "motion/react" 
import { Input } from "../ui/input"
import CreateShortcutDialog from "./CreateShortcutDialog"
import CreateFolderDialog from "./CreateFolderDialog"
export default function AddGridItemButton({items, setItems}: {items: GridItemType[], setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>}) {
    const [showMenu, setShowMenu] = useState(false)
    const [showCreateShortcut, setShowCreateShortcut] = useState(false)
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [expandIconDialog, setExpandIconDialog] = useState(false)
    const menuVariants = {
        hidden: {},
        visible: {
            transition: {
            delayChildren: stagger(0.05),
            },
        },
        exit: {
            
        }
    }
    const exitTransiton = {
        opacity: { duration: 0.15 },
    }

    return <>
        <AnimatePresence>
            {(showMenu || showCreateShortcut || showCreateFolder) && <motion.div key="menuBackground" initial={{opacity: 0}} animate={{opacity: (showCreateShortcut || showCreateFolder) ? 0.9 : 0.4}} exit={{opacity: 0}} className={`fixed top-0 left-0 w-screen h-screen z-10 bg-background`} onClick={()=>{
                if (expandIconDialog){
                    setExpandIconDialog(false)
                } else {
                    setShowMenu(false)
                    setShowCreateShortcut(false)
                    setShowCreateFolder(false)
                }
            }}></motion.div>}
            {showCreateShortcut && <CreateShortcutDialog expandIconDialog={expandIconDialog} setExpandIconDialog={setExpandIconDialog} setItems={setItems} setShowCreateShortcut={setShowCreateShortcut}/>}
            {showCreateFolder && <CreateFolderDialog setShowCreateFolder={setShowCreateFolder} setItems={setItems} showFolderIconPicker={expandIconDialog} setShowFolderIconPicker={setExpandIconDialog}/>}
        </AnimatePresence>
        <div className="flex flex-col items-center fixed bottom-4 gap-3 z-10">
            <AnimatePresence>
                {showMenu && <motion.div key="itemList" variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="gap-2.5 flex">
                    <motion.div key="addShortcut" 
                        layoutId="addShortcutButton"
                        variants={{
                            hidden: { opacity: 0, y: 35, x: 25, rotate: -3 },
                            visible: { opacity: 1, y: 0, x: 0, rotate: -3 },
                            exit: { opacity: 0, y: 70, x: 20, rotate: -3,transition: exitTransiton },
                        }} 
                        whileHover={{y: -5, scale: 1.1, rotate: -1}}
                        whileTap={{scale: 1.0, y: -1}}
                    >
                        <Button variant="secondary" className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground" size="default" onClick={async()=>{
                            setShowMenu(!showMenu)
                            setShowCreateShortcut(true)
                        }}>
                            <SquareDashedPlus/>
                            Shortcut
                        </Button>
                    </motion.div>
                    <motion.div key="addFolder" 
                        layoutId="addFolderButton"
                        variants={{
                            hidden: { opacity: 0, y: 35, x: -25, rotate: 3 },
                            visible: { opacity: 1, y: 0, x: 0, rotate: 3 },
                            exit: { opacity: 0, y: 70, x: -20, rotate: 3, transition: exitTransiton},
                        }} whileHover={{y: -5, scale: 1.1, rotate: 1}}
                        whileTap={{scale: 1.0, y: -1}}
                    >
                        <Button variant="secondary" className="bg-foreground text-background hover:bg-primary/90 hover:text-primary-foreground" size="default" onClick={async()=>{
                            setShowMenu(!showMenu)
                            setShowCreateFolder(true)
                        }}>
                            <FolderPlus/>
                            Folder
                        </Button>
                    </motion.div>
                </motion.div>}
                {(!showCreateShortcut && !showCreateFolder) && <motion.div key="addButton" animate={{marginBottom: showMenu ? 5 : 0, opacity: 1}} exit={{opacity: 0}} whileTap={{scale: 0.95}}>
                    <Button variant={showMenu ? "secondary" : "ghost"} className=" flex flex-col relative w-28 h-8 overflow-hidden" size="sm" onClick={async()=>{
                        setShowMenu(!showMenu)
                        // try {
                        //         setItems(await addGridItem({
                        //         id: crypto.randomUUID(),
                        //         updatedAt: new Date(),
                        //         name: "New Item",
                        //         type: "websiteShortcut",
                        //         url: "https://slack.com",
                        //         image: "https://assets-global.website-files.com/60859bd6bcdbd1376fd8504b/64005db3442ed885977389f5_Slack_icon_2019.svg.png"
                        //     }))
                        // } catch (error) {
                        //     toast.add({
                        //         title: "Error adding item",
                        //         description: "There was an error adding the item. Please try again.",
                        //         type: "error"
                        //     })
                        // }
                    }}>
                        <AnimatePresence>
                            {showMenu ?
                                <motion.div key="closeMenu" initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className={`flex gap-1 items-center justify-center absolute top-0 left-0 h-8 w-full`}>
                                    <ChevronDown/>
                                </motion.div>
                            : <motion.div initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -20, opacity: 0}} key="openMenu" className={`flex gap-1 items-center justify-center absolute top-0 left-0 h-8 w-full`}>
                                <Plus/> Add item
                            </motion.div>}
                        </AnimatePresence>
                    </Button>
                </motion.div>}
            </AnimatePresence>
        </div>
    </>
}