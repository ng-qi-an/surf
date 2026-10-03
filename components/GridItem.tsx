import { useSortable } from '@dnd-kit/react/sortable';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

const springValues = {
    damping: 30,
    stiffness: 400,
    mass: 1
};
const amp = 0.5;

export default function GridItem({ id, index }: { id: string; index: number }) {
    const { ref: dragRef } = useSortable({ id, index });
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

        // The stronger X angle makes the card tilt down under the pointer.
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

    return (
        <div ref={dragRef}>
            <div
                ref={itemRef}
                onMouseMove={handleMouse}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 800 }}
            >
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        scale,
                        transformStyle: 'preserve-3d'
                    }}
                    className="w-full min-w-30 h-30 bg-card rounded-lg border-1 border flex items-center justify-center"
                >
                    <h1>{id}</h1>
                </motion.div>
            </div>
        </div>
    );
}
