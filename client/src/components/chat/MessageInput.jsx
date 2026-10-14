import { useState } from "react";
import { Send, Paperclip, Smile, Sparkles, WifiOff } from "lucide-react";

// Common Emojis quick picker bar toggle
const QUICK_EMOJIS = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "🙌", "✨"];

function MessageInput({
  value,
  onChange,
  onSend,
  connected,
}) {
  const [showEmojis, setShowEmojis] = useState(false);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      setShowEmojis(false);
    }
  }

  function addEmoji(emoji) {
    onChange(value + emoji);
  }

  return (
    <div className="relative shrink-0 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-xl p-3 sm:p-4 z-20">
      {/* Quick Emoji Bar Overlay */}
      {showEmojis && (
        <div className="absolute bottom-full left-4 mb-2 flex items-center gap-1.5 rounded-2xl bg-slate-800/95 border border-slate-700/80 p-2 shadow-2xl backdrop-blur-xl animate-fade-in z-30">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-base hover:bg-slate-700/80 hover:scale-125 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto flex max-w-4xl items-end gap-2">
        {/* Input box wrapper */}
        <div className="flex flex-1 items-end gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-800/60 p-2 transition duration-200 focus-within:border-indigo-500 focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/25">
          {/* Attachment button */}
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-700/80 hover:text-slate-200 active:scale-95"
            aria-label="Attach file"
            title="Attach file"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition active:scale-95 ${
              showEmojis
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
            }`}
            aria-label="Emoji picker"
            title="Add emoji"
          >
            <Smile className="h-4.5 w-4.5" />
          </button>

          {/* Text Area */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!connected}
            placeholder={
              connected
                ? "Type a message... (Press Enter to send)"
                : "Reconnecting to server..."
            }
            className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => {
            onSend();
            setShowEmojis(false);
          }}
          disabled={!value.trim() || !connected}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:shadow-indigo-600/40 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 shadow-sm"
          aria-label="Send message"
          title="Send message"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;