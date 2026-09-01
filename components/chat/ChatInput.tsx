import AddItemButton from "@/components/chat/AddItemButton";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { CornerDownLeft, Search } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Spinner } from "../ui/spinner";

export default function ChatInput({showExpandedChatInput, value, loading, disabled, suggestionListId, onChange, onHeightChange, onSubmitClick, onClick, onFocus, onBlur, onKeyDown, searchSuggestions, activeSuggestionIndex}:{showExpandedChatInput: boolean, value: string, loading?: boolean, disabled?: boolean, suggestionListId?: string, onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void, onHeightChange?: (height: number) => void, onSubmitClick?: () => void, onClick?: () => void, onFocus?: ()=> void, onBlur?: ()=> void, onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void, searchSuggestions?: string[], activeSuggestionIndex?: number}){
    return <InputGroup>
          {!showExpandedChatInput && <InputGroupAddon align="inline-start">
            <AddItemButton/>
          </InputGroupAddon>}
          <TextareaAutosize autoFocus value={value} data-slot="input-group-control" placeholder="Search for anything..."
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
          <InputGroupAddon align={showExpandedChatInput ? "block-end" : "inline-end"} className={showExpandedChatInput ? "pt-0" : ""}>
              {showExpandedChatInput && <AddItemButton/>}
              <InputGroupButton disabled={disabled || loading || !value} variant={showExpandedChatInput ? "default" : "ghost"} size={showExpandedChatInput ? "sm" : "icon-sm"} className="ml-auto" onClick={onSubmitClick}>
                { showExpandedChatInput ? <>Surf {loading ? <Spinner/> : <CornerDownLeft />}</> : <Search />}
                <span className="sr-only">Search</span>
              </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
}