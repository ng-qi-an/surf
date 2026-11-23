import { Globe, SquareDashedPlus } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react"; 
export default function ShortcutIcon({icon, iconType, setIcon, website}: {icon: string, iconType: string, setIcon: (icon: string)=> void, website: string}){
    return <AnimatePresence mode="wait">
        <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}} key={icon}>
            {icon == "empty" ? <Globe/> : icon ? iconType == "icon" ? <DynamicIcon name={icon as IconName} className="size-8" aria-hidden="true" /> : <img loading={"lazy"} width={32} height={32} src={icon} onError={(e)=> {console.log(e); setIcon("empty")}}/> : <SquareDashedPlus className={`size-6 ${website && "animate-pulse"} transition-all`}/>}
        </motion.div>
    </AnimatePresence>
}