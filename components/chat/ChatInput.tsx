import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { CornerDownLeft, Search, Square } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Spinner } from "../ui/spinner";
import AddOptions from "./AddOptions";
import { ChatAttachment } from "@/lib/types";
import { useChatContext } from "../providers/chat-provider";
import ChatAttachmentList from "./ChatAttachmentList";
import { useEffect } from "react";

export default function ChatInput({showExpandedChatInput, setShowExpandedChatInput, showChatWhenCollapsed, loading, disabled, showStop, suggestionListId, onChange, onHeightChange, onSubmitClick, onClick, onFocus, onBlur, onKeyDown, searchSuggestions, activeSuggestionIndex}:{showExpandedChatInput: boolean, setShowExpandedChatInput?: (value: boolean)=> void, showChatWhenCollapsed: boolean, loading?: boolean, disabled?: boolean, showStop?: boolean, suggestionListId?: string, onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void, onHeightChange?: (height: number) => void, onSubmitClick?: () => void, onClick?: () => void, onFocus?: ()=> void, onBlur?: ()=> void, onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void, searchSuggestions?: string[], activeSuggestionIndex?: number}) {
    const {input, attachments, uploadingFiles} = useChatContext();
    useEffect(()=>{
      if (attachments.length > 0 && !showExpandedChatInput && setShowExpandedChatInput) {
        setShowExpandedChatInput(true);
      }
    }, [attachments, showExpandedChatInput])
    return <InputGroup className="bg-card border-border">
          {!showExpandedChatInput && <InputGroupAddon align="inline-start" className="pl-1">
            <AddOptions/>
          </InputGroupAddon>}
          {attachments && attachments.length > 0 && <InputGroupAddon align="block-start">
            <ChatAttachmentList/>
          </InputGroupAddon>}
          <TextareaAutosize autoFocus value={input} data-slot="input-group-control" placeholder="Search for anything..."
            className={`flex h-12 min-h-4 w-full resize-none rounded-full bg-transparent ${showExpandedChatInput ? "px-4 pt-3.5 pb-2" : 'px-1 pr-2 py-3.5'} rounded-none text-base transition-[color,box-shadow] outline-none md:text-sm`}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={!showExpandedChatInput && searchSuggestions && searchSuggestions.length > 0}
            aria-controls={!showExpandedChatInput && searchSuggestions && searchSuggestions.length > 0 ? suggestionListId : undefined}
            aria-activedescendant={(activeSuggestionIndex !== undefined && activeSuggestionIndex >= 0) ? `search-suggestion-${activeSuggestionIndex}` : undefined}
            onChange={onChange}
            onHeightChange={(height) => {
                onHeightChange?.(height);
            }}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <InputGroupAddon align={showExpandedChatInput ? "block-end" : "inline-end"} className={`${showExpandedChatInput ? "pt-0 pl-1" : ""}`}>
              {showExpandedChatInput && <AddOptions/>}
              <InputGroupButton disabled={!showStop && (disabled || loading || (!input.trim() && attachments.length == 0) || uploadingFiles)} variant={(showExpandedChatInput || showChatWhenCollapsed) ? "default" : "ghost"} size={showExpandedChatInput ? "sm" : "icon-sm"} className="ml-auto" onClick={onSubmitClick}>
                { showStop ? <>Stop <Square/></> :  showExpandedChatInput ? <>Surf {loading ? <Spinner/> : <CornerDownLeft />}</> : showChatWhenCollapsed ? <CornerDownLeft/> : <Search />}
              </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
}