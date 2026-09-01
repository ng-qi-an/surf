'use client';

import SideRays from "@/components/backgrounds/SideRays";
import AddItemButton from "@/components/chat/AddItemButton";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { CornerDownLeft, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import createChat from "@/lib/actions/createChat";
import ChatInput from "@/components/chat/ChatInput";

export default function Home() {
  const [input, setInput] = useState("");
  const [showExpandedChatInput, setShowExpandedChatInput] = useState(false);
  const defaultHeight = 48;
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const suggestionListId = "search-suggestions";
  const router = useRouter();
  async function chatInputSubmit(query?: string, forceChat?: boolean) {
    if (!forceChat && !showExpandedChatInput) {
      window.location.href = `https://google.com/search?q=${encodeURIComponent(query || input)}`;
    } else {
      const newChatId = await createChat();
      router.push(`/chat/${newChatId}`);
    }
  }
  async function updateSearchSuggestions(query: string) {
    if (!query) {
      setSearchSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }
    const url = `/api/suggestions?q=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchSuggestions(data);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSearchSuggestions([]);
    }
  }
  return <> 
  <div className="w-screen h-screen absolute z-0 top-0 left-0">
    <SideRays
      speed={2.5}
      rayColor1="#EAB308"
      rayColor2="#96c8ff"
      intensity={2}
      spread={2}
      origin="top-right"
      className="z-0 absolute top-0 left-0"
      tilt={0}
      saturation={1.5}
      blend={0.75}
      falloff={1.6}
      opacity={1}
    />
  </div>
  <motion.div layout key="homePage" className="min-w-0 flex-1 h-screen flex flex-col items-center justify-center overflow-auto">
    <div className="flex flex-col items-center w-full max-w-[500px] relative">
      <h1 className="text-3xl font-medium mb-1 font-heading">Welcome back!</h1>
      <p className={`text-xs text-muted-foreground mb-4 ${input ? "opacity-50" : "opacity-0"} transition-all duration-400 delay-100`}>Ctrl+Enter for chat. Shift+Enter for new line.</p>
      <motion.div className="relative w-full">
        <ChatInput 
          value={input} 
          suggestionListId={suggestionListId}
          activeSuggestionIndex={activeSuggestionIndex}
          showExpandedChatInput={showExpandedChatInput}
          searchSuggestions={searchSuggestions}
          onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              if (!value) {
                  setShowExpandedChatInput?.(false);
                  setSearchSuggestions?.([]);
                  setActiveSuggestionIndex?.(-1);
              } else {
                  updateSearchSuggestions(value);
              }
          }} 
          onHeightChange={(height) => {
            if (height > defaultHeight) {
                setShowExpandedChatInput(true);
                setActiveSuggestionIndex(-1);
            }
          }}
          onKeyDown={(e)=>{
            if (!showExpandedChatInput && searchSuggestions.length > 0) {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSuggestionIndex((currentIndex) =>
                  currentIndex < searchSuggestions.length - 1 ? currentIndex + 1 : 0
                );
                setInput(searchSuggestions[activeSuggestionIndex + 1] || searchSuggestions[0]);
                return;
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSuggestionIndex((currentIndex) =>
                  currentIndex > 0 ? currentIndex - 1 : searchSuggestions.length - 1
                );
                setInput(searchSuggestions[activeSuggestionIndex + 1] || searchSuggestions[0]);
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setShowSearchSuggestions(false);
                setActiveSuggestionIndex(-1);
                return;
              }
              if (e.key == "Enter" && e.ctrlKey || e.metaKey){
                e.preventDefault();
                chatInputSubmit(undefined, true);
                return;
              }
              if (e.key === "Enter" && !e.shiftKey && activeSuggestionIndex >= 0) {
                e.preventDefault();
                chatInputSubmit(searchSuggestions[activeSuggestionIndex]);
                return;
              }
            }
            if (e.key == "Enter" && !e.shiftKey) {
              e.preventDefault();
              chatInputSubmit();
            }
          }}
          onSubmitClick={()=>{
            chatInputSubmit();
          }}
          onClick={()=>{
            setShowSearchSuggestions(true);
          }}
          onFocus={()=>{
            setShowSearchSuggestions(true);
          }}
          onBlur={()=>{
            setActiveSuggestionIndex(-1);
            setShowSearchSuggestions(false);
          }}
        />
        {!showExpandedChatInput && showSearchSuggestions && searchSuggestions.length > 0 && <div id={suggestionListId} role="listbox" className="absolute left-0 top-[110%] z-10 mt-1 w-full overflow-hidden border border-border bg-card rounded-2xl">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  id={`search-suggestion-${index}`}
                  role="option"
                  aria-selected={activeSuggestionIndex === index}
                  className={`px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-3 ${activeSuggestionIndex === index ? "bg-muted" : ""}`}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => chatInputSubmit(suggestion)}
                >
                  <Search className="size-3 text-muted-foreground"/>
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
        </div>}
      </motion.div>
    </div>
  </motion.div>
  <div className="absolute bottom-4 right-4 z-10 opacity-50 hover:opacity-100 overflow-auto">
    <ThemeToggle className=""/>
  </div>
</>
}
