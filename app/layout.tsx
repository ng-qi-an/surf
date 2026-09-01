import type { Metadata } from "next";
import { Inter, Roboto_Slab, Geist_Mono } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatList from "@/components/chat/ChatList";
import { AnimatePresence } from "motion/react";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Surf",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoSlab.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex absolute top-0 left-0 z-10 w-screen h-screen">
              <AnimatePresence>
                <ChatList key="e"/>
                {children}
              </AnimatePresence>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
