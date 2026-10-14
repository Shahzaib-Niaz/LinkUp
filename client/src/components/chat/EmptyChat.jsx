import { Sparkles, Zap, ShieldCheck, UserCheck } from "lucide-react";
import { LinkUpIcon } from "../common/LinkUpLogo";

function EmptyChat() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-[#090d16] px-6 py-12 text-slate-100 font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px] animate-pulse-glow" />

      <div className="relative z-10 max-w-md text-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl animate-fade-in">
        {/* Floating Icon Badge */}
        <div className="inline-flex relative mb-6">
          <LinkUpIcon size={72} className="animate-float" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          Welcome to <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">LinkUp</span>
        </h2>


        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm mx-auto">
          Select a contact or conversation from the sidebar to start exchanging real-time messages instantly.
        </p>

        {/* Highlight feature pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 text-[11px] font-medium text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Real-time Socket.IO
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 text-[11px] font-medium text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Secure Sessions
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 text-[11px] font-medium text-slate-300">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" /> Live Presence
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmptyChat;