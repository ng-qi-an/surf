import { Globe, SquareDashedPlus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react"; 
export default function ShortcutIcon({icon, setIcon, website}: {icon: string, setIcon: (icon: string)=> void, website: string}){
    return <AnimatePresence mode="wait">
        <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}} key={icon}>
            {icon == "empty" ? <Globe/> : icon ? <img loading={"lazy"} width={32} height={32} src={icon} onError={(e)=> {console.log(e); setIcon("empty")}}/> : <SquareDashedPlus className={`size-6 ${website && "animate-pulse"} transition-all`}/>}
        </motion.div>
    </AnimatePresence>
}