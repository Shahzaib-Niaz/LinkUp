
import { ArrowLeft, Phone, Video, MoreVertical, WifiOff, ShieldCheck } from "lucide-react";

// Helper for dynamic user avatar gradients
const AVATAR_GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-fuchsia-600",
];

function getAvatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function ChatHeader({ user, connected, online = false, onBack }) {
  const avatarGradient = getAvatarGradient(user?.fullName);

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl px-4 sm:px-6 text-slate-100 z-10">
      {/* Mobile back button */}
      <button
        type="button"
        onClick={onBack}
        className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white md:hidden active:scale-95"
        aria-label="Go back to contacts"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Contact Avatar */}
      <div className="relative flex items-center">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient} text-sm font-bold text-white shadow-md`}>
          {user?.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Contact online dot */}
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
          </span>
        )}
      </div>

      {/* Contact Info */}
      <div className="ml-3.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-bold text-white tracking-tight">
            {user?.fullName || "Unknown user"}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          {connected ? (
            <>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  online ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              <p className={`truncate text-xs ${online ? "text-emerald-400 font-medium" : "text-slate-400"}`}>
                {online ? "Online • Active now" : "Offline"}
              </p>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 shrink-0 text-amber-400 animate-bounce" />
              <p className="truncate text-xs text-amber-400 font-medium">
                Reconnecting socket...
              </p>
            </>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400 active:scale-95"
          aria-label="Start voice call"
          title="Voice call"
        >
          <Phone className="h-4.5 w-4.5" />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400 active:scale-95"
          aria-label="Start video call"
          title="Video call"
        >
          <Video className="h-4.5 w-4.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
          aria-label="More options"
          title="More options"
        >
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;