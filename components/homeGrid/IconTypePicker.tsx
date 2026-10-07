import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
export default function IconTypePicker({value, onChange, options}: {value: string, onChange: (value: string)=> void, options: {label: string, icon: LucideIcon, value: string}[]}){
    const [layoutIdEnabled, setLayoutIdEnabled] = useState(false)

    useEffect(() => {
        setLayoutIdEnabled(true)
    }, [])

    return <div className="flex items-center gap-1 w-full p-1 bg-input/50 rounded-full">
        {options.map((option) => (
            <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`py-2 pl-2 pr-3 relative rounded-full flex items-center gap-2 text-sm ${value === option.value ? 'text-primary-foreground' : 'text-secondary-foreground hover:bg-input'}`}
            >
                {value === option.value && <motion.div key={layoutIdEnabled ? "iconTypePickerBackground" : undefined} layoutId={layoutIdEnabled ? "iconTypePickerBackground" : undefined} className="h-full w-full bg-primary rounded-full absolute left-0 top-0 -z-1" transition={{layout: {
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.25,
                        }}}/>}
                <option.icon className="size-4" />
                <span>{option.label}</span>
            </button>
        ))}
    </div>
}
