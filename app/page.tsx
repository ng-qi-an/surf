'use client';

import SideRays from "@/components/backgrounds/SideRays";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, stagger } from "motion/react";
import { useRouter } from "next/navigation";
import createChat from "@/lib/actions/createChat";
import ChatInput from "@/components/chat/ChatInput";
import { getRandomWelcomeText } from "@/lib/welcomeTexts";
import { useChatContext } from "@/components/providers/chat-provider";
import { useTheme } from "next-themes";
import GradientWaves from "@/components/backgrounds/GradientWaves";
import HomeGrid from "@/components/homeGrid/HomeGrid";

export default function Home() {
  const { input, setInput, attachments, uploadingFiles } = useChatContext();
  const [showExpandedChatInput, setShowExpandedChatInput] = useState(false);
  const defaultHeight = 48;
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const suggestionListId = "search-suggestions";
  const [showChatWhenCollapsed, setShowChatWhenCollapsed] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);
  const [welcome, setWelcome] = useState("");
  const { resolvedTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  const router = useRouter();
  async function chatInputSubmit(query: string, forceChat?: boolean) {
    if (!forceChat && !showExpandedChatInput) {
      window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
    } else {
      if (uploadingFiles || (!query.trim() && attachments.length == 0)) return;
      const newChatId = await createChat();
      router.push(`/chat/${newChatId}?newChat=true`);
    }
  }
  useEffect(()=>{
    async function fetchQuote() {
      try {
        const response = await fetch('/api/quote');
        const data = await response.json();
        console.log("Fetched quote:", data);
        setQuote(data);
      } catch (error) {
        console.error("Failed to fetch quote:", error);
      }
    }
    setWelcome(getRandomWelcomeText());
    fetchQuote();
  }, []);
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
  useEffect(()=>{
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key == "Control" || e.key == "Meta") && input.length > 0) {
        setShowChatWhenCollapsed(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
        setShowChatWhenCollapsed(false);
    }
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [input]);
    const welcomeText = {
      hidden: { y: 10, opacity: 0 },
      show: { y: 0, opacity: 1 },
    }
  return <> 
  <div className="w-screen h-screen absolute z-0 top-0 left-0">
    {loaded && (resolvedTheme == "light" ? 
    <GradientWaves
      key="lighthomebackground"
      horizonColor="#3b82f6"
      waveColor="#8b5cf6"
      crestColor="#3b82f6"      
      speed={0.3}
      amplitude={2.5}
      waveScale={0.5}
      waveRatio={0.9}
      swell={35}
      turbulence={23}
      tilt={1.11}
      zoom={1}
      height={5.5}
      fogDepth={15}
      detail="medium"
      brightness={0.85}
      opacity={1}
      grain
      grainIntensity={0.025}
      mouseInteraction
      parallaxStrength={0.6}
      className="opacity-40"
    />
    :
    <SideRays
      key="darkhomebackground"
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
    />)}
  </div>
  <motion.div layout key="homePage" className="min-w-0 flex-1 h-screen flex flex-col items-center justify-center overflow-auto">
    <div className="flex flex-col items-center w-full max-w-[500px] relative">
      <motion.h1                     
        initial="hidden"
        animate="show"
        variants={{
        hidden: {},
        show: {
            transition: {
                delayChildren: stagger(0.03)
            }
        }
        }}
        className="text-3xl font-medium mb-2 font-heading">
          {welcome.split(" ").map((text, index)=>{
            return <motion.span  key={text+welcome+index} variants={welcomeText} className="inline-block mr-2">{text}</motion.span>
        })}
      </motion.h1>
      <AnimatePresence mode="wait">
        {input ?
          <motion.p 
            key="text-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            className={`text-sm text-foreground/50 mb-6`}>
            Ctrl+Enter for chat. Shift+Enter for new line.
          </motion.p>
        : quote ? <motion.p
          key="quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          exit={{ opacity: 0 }}
          className={`text-sm text-foreground/50 mb-6 text-center line-clamp-1 hover:line-clamp-none`}>
          "{quote.quote || "."}" - {quote.author}
        </motion.p> : <p className="h-5 mb-6"></p>}
      </AnimatePresence>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{delay: 0.1}} className="relative w-full">
        <ChatInput 
          suggestionListId={suggestionListId}
          activeSuggestionIndex={activeSuggestionIndex}
          showExpandedChatInput={showExpandedChatInput}
          setShowExpandedChatInput={setShowExpandedChatInput}
          showChatWhenCollapsed={showChatWhenCollapsed}
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
              if (e.key == "Enter" && (e.ctrlKey || e.metaKey)){
                e.preventDefault();
                console.log("sending message")
                chatInputSubmit(input, true);
                return;
              }
              if (!showExpandedChatInput && searchSuggestions.length > 0){
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
                if (e.key === "Enter" && !e.shiftKey && activeSuggestionIndex >= 0) {
                  e.preventDefault();
                  chatInputSubmit(searchSuggestions[activeSuggestionIndex]);
                  return;
                }
              }
            if (e.key == "Enter" && !e.shiftKey) {
              e.preventDefault();
              chatInputSubmit(input);
            }
          }}
          onSubmitClick={()=>{
            chatInputSubmit(input);
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
      <HomeGrid/>
    </div>
  </motion.div>
  <div className="absolute bottom-4 right-4 z-10 opacity-50 hover:opacity-100 overflow-auto">
    <ThemeToggle className=""/>
  </div>
</>
}
