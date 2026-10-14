import MessageBubble from "./MessageBubble";
import { Loader2, MessageSquareDashed, ShieldCheck, Sparkles } from "lucide-react";

function MessageList({
  messages,
  loading,
  currentUserId,
  messagesEndRef,
}) {
  if (loading) {
    return (
      <div className="relative min-h-0 flex-1 flex flex-col items-center justify-center bg-[#090d16] px-4 py-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
          <p className="text-xs font-semibold text-slate-300">
            Loading message history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto bg-[#090d16] px-3 py-4 sm:px-6">
      {/* Background ambient subtle glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-600/5 blur-[100px]" />

      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-xs text-center p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl animate-fade-in shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-7 w-7" />
            </div>

            <h3 className="text-sm font-bold text-slate-100">
              Say hello to start chat!
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Send your first message below to start your conversation in real time.
            </p>

            <div className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Real-time Socket.IO Connection</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-1.5 pb-2">
          {/* Top Encrypted / Privacy Banner */}
          <div className="my-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-slate-800 px-3 py-1 text-[11px] font-medium text-slate-400 shadow-sm backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Messages are encrypted and transmitted in real-time</span>
            </span>
          </div>

          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default MessageList;