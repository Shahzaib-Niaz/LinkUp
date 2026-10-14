import { CheckCheck, Check } from "lucide-react";

function MessageBubble({
  message,
  currentUserId,
}) {
  const senderId = message.sender?._id?.toString();
  const isMine = senderId === currentUserId?.toString();

  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex my-1 animate-fade-in ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[85%] sm:max-w-[72%] ${
          isMine ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`relative px-4 py-2.5 shadow-sm transition-all ${
            isMine
              ? "rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-indigo-600/15"
              : "rounded-2xl rounded-tl-xs bg-slate-800/90 border border-slate-700/60 text-slate-100"
          }`}
        >
          {!isMine && (
            <p className="mb-1 text-[11px] font-bold text-indigo-400 tracking-wide">
              {message.sender?.fullName || "User"}
            </p>
          )}

          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="break-words text-xs sm:text-sm leading-relaxed font-normal select-text">
              {message.text}
            </p>

            <div className="ml-auto flex shrink-0 items-center gap-1 self-end pb-0.5">
              <span
                className={`text-[10px] ${
                  isMine ? "text-indigo-200/80" : "text-slate-400"
                }`}
              >
                {time}
              </span>

              {isMine && (
                <CheckCheck className="h-3.5 w-3.5 text-indigo-200" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;