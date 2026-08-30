'use client';

import SideRays from "@/components/backgrounds/SideRays";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  return <div> 
  <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
    <SideRays
      speed={2.5}
      rayColor1="#EAB308"
      rayColor2="#96c8ff"
      intensity={2}
      spread={2}
      origin="top-right"
      tilt={0}
      saturation={1.5}
      blend={0.75}
      falloff={1.6}
      opacity={1}
    />
  </div>
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 overflow-auto">
    <ThemeToggle className=""/>
  </div>
</div>
}
