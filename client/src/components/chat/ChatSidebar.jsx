
import { useMemo } from "react";
import {
  Search,
  X,
  Plus,
  MessageSquare,
  Users,
  LogOut,
  Sparkles,
  Check,
  CheckCheck,
} from "lucide-react";
import LinkUpLogo from "../common/LinkUpLogo";

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

function formatChatTime(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

function getOtherParticipant(conversation, currentUserId) {
  const participants = conversation?.participants || [];

  return participants.find((participant) => {
    const participantId =
      typeof participant === "object" ? participant?._id : participant;

    return String(participantId) !== String(currentUserId);
  });
}

function OnlineDot({ online = false, className = "" }) {
  if (!online) return null;

  return (
    <span className={`absolute bottom-0 right-0 flex h-3.5 w-3.5 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
    </span>
  );
}

function ChatSidebar({
  user,
  users = [],
  conversations = [],
  selectedUser,
  usersLoading = false,
  usersError = "",
  searchTerm = "",
  onSearchChange,
  onSelectUser,
  onLogout,
  onNewChat,
  showContacts = false,
  onlineUserIds = new Set(),
}) {
  const currentUserId = user?._id;
  const search = searchTerm.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const name = item.fullName || "";
      const email = item.email || "";

      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search)
      );
    });
  }, [users, search]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const otherUser = getOtherParticipant(
        conversation,
        currentUserId
      );

      if (!otherUser || typeof otherUser !== "object") return false;

      const name = otherUser.fullName || "";
      const email = otherUser.email || "";

      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search)
      );
    });
  }, [conversations, currentUserId, search]);

  const isOnline = (userId) =>
    onlineUserIds.has(String(userId));

  return (
    <aside
      className={`${
        selectedUser ? "hidden md:flex" : "flex"
      } h-full w-full shrink-0 flex-col border-r border-slate-800/80 bg-slate-900 text-slate-100 md:w-[380px] font-sans`}
    >
      {/* Sidebar header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4 sm:px-5">
        <LinkUpLogo size={34} />

        <div className="flex items-center gap-1.5">

          <button
            type="button"
            onClick={() => onNewChat?.(!showContacts)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              showContacts
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-95"
            }`}
          >
            {showContacts ? (
              <>
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chats</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-rose-400 active:scale-95"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* User profile banner */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-800/60 p-2.5 border border-slate-700/50">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md">
            {getInitial(user?.fullName)}
            <OnlineDot online={isOnline(currentUserId)} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-100">
              {user?.fullName || "My Account"}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {user?.email || ""}
            </p>
          </div>
          <span className="shrink-0 flex h-2 w-2 rounded-full bg-emerald-500" title="Active Account" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="shrink-0 px-4 py-3">
        <div className="relative flex items-center rounded-2xl bg-slate-800/70 border border-slate-700/60 px-3 py-2 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            placeholder={
              showContacts
                ? "Search people..."
                : "Search conversations..."
            }
            className="w-full bg-transparent px-2.5 text-xs text-slate-100 outline-none placeholder:text-slate-500"
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="text-slate-400 hover:text-slate-200 transition"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 border border-slate-700/80 rounded px-1.5 py-0.5 font-mono">
              /
            </span>
          )}
        </div>
      </div>

      {/* Category Tab Indicator */}
      <div className="flex shrink-0 items-center justify-between px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/40">
        <span className="flex items-center gap-1.5 text-slate-300">
          {showContacts ? (
            <>
              <Users className="h-3.5 w-3.5 text-indigo-400" /> People Directory
            </>
          ) : (
            <>
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" /> Recent Messages
            </>
          )}
        </span>

        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-indigo-300 font-bold">
          {showContacts
            ? filteredUsers.length
            : filteredConversations.length}
        </span>
      </div>

      {/* Conversations / People list */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1">
        {showContacts ? (
          <>
            {usersLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                <p className="text-xs">Loading people...</p>
              </div>
            ) : usersError ? (
              <p className="px-4 py-8 text-center text-xs text-rose-400">
                {usersError}
              </p>
            ) : filteredUsers.length === 0 ? (
              <div className="px-6 py-10 text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto text-slate-600 mb-2 opacity-50" />
                <p className="text-xs font-medium">
                  {search
                    ? "No users found matching search."
                    : "No other users available."}
                </p>
              </div>
            ) : (
              filteredUsers.map((item) => {
                const online = isOnline(item._id);
                const avatarGradient = getAvatarGradient(item.fullName);

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => onSelectUser(item)}
                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-150 hover:bg-slate-800/80 active:scale-[0.99]"
                  >
                    <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient} font-bold text-white shadow-md`}>
                      {getInitial(item.fullName)}
                      <OnlineDot online={online} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs font-bold text-slate-100">
                          {item.fullName || "Unknown User"}
                        </p>
                        {online && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                            Online
                          </span>
                        )}
                      </div>

                      <p className="truncate text-[11px] text-slate-400 mt-0.5">
                        {item.email || "Click to message"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </>
        ) : (
          <>
            {filteredConversations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  {search ? "No matches found" : "No conversations yet"}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 max-w-[200px] mx-auto">
                  {search
                    ? "Try a different search query."
                    : "Start a conversation to begin messaging."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={() => onNewChat?.(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Find People</span>
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherUser = getOtherParticipant(
                  conversation,
                  currentUserId
                );

                if (!otherUser || typeof otherUser !== "object") {
                  return null;
                }

                const otherUserId = otherUser._id;
                const active =
                  String(selectedUser?._id) ===
                  String(otherUserId);

                const online = isOnline(otherUserId);
                const lastMessage = conversation.lastMessage;

                const isMine =
                  lastMessage?.sender &&
                  String(
                    typeof lastMessage.sender === "object"
                      ? lastMessage.sender._id
                      : lastMessage.sender
                  ) === String(currentUserId);

                const preview = lastMessage?.text
                  ? `${isMine ? "You: " : ""}${lastMessage.text}`
                  : "No messages yet";

                const time = formatChatTime(
                  lastMessage?.createdAt || conversation.updatedAt
                );
                const avatarGradient = getAvatarGradient(otherUser.fullName);

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => onSelectUser(otherUser)}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-150 ${
                      active
                        ? "bg-indigo-600/15 border border-indigo-500/30 text-white shadow-lg"
                        : "hover:bg-slate-800/70 text-slate-300"
                    }`}
                  >
                    {/* Active accent bar */}
                    {active && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r-full" />
                    )}

                    <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient} font-bold text-white shadow-md`}>
                      {getInitial(otherUser.fullName)}
                      <OnlineDot online={online} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`truncate text-xs font-bold ${active ? "text-white" : "text-slate-200"}`}>
                          {otherUser.fullName || "Unknown User"}
                        </p>

                        <span className="shrink-0 text-[10px] text-slate-400">
                          {time}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-1">
                        <p className={`truncate text-[11px] ${active ? "text-indigo-200" : "text-slate-400"}`}>
                          {preview}
                        </p>

                        {online && (
                          <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-400" title="Online" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;


