import { useSortable } from '@dnd-kit/react/sortable';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, useState } from 'react';
import GridCardProvider from '../providers/grid-card-provider';
import { GridItemType } from '@/lib/db';

const springValues = {
    damping: 30,
    stiffness: 400,
    mass: 1
};
const amp = 0.5;

export default function HomeGridCard({ id, index, items, setItems, children }: { id: string; index: number, items: GridItemType[], setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>, children: React.ReactNode }) {
    const { ref: dragRef, isDragging } = useSortable({ id, index });
    const [enableEffect, setEnableEffect] = useState(true);
    const itemRef = useRef<HTMLDivElement>(null);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
        if (!itemRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const pointerX = (e.clientX - rect.left) / rect.width;
        const pointerY = (e.clientY - rect.top) / rect.height;
        const normalizedX = (pointerX - 0.5) * 2;
        const normalizedY = (pointerY - 0.5) * 2;
        rotateX.set(-normalizedY * 24 * amp);
        rotateY.set(normalizedX * 18 * amp);
    }
    function handleMouseEnter() {
        scale.set(1.03);
    }
    function handleMouseLeave() {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }
    function handleMouseDown(){
        scale.set(0.97);
    }
    function handleMouseUp(){
        scale.set(1.03);
    }
    return <GridCardProvider items={items} setItems={setItems} isDragging={isDragging} enableEffect={enableEffect} setEnableEffect={setEnableEffect}>
        <div ref={dragRef}>
            <div
                ref={itemRef}
                onMouseMove={handleMouse}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 800 }}
            >
                <motion.div
                    style={enableEffect ? {
                        rotateX,
                        rotateY,
                        scale,
                        transformStyle: 'preserve-3d'
                    } : {scale}}
                    className="w-full min-w-30 h-30 flex items-center justify-center"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    </GridCardProvider>;
}
