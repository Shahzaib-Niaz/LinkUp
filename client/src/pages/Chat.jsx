
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";

import { getUsers } from "../api/users";
import {
  createConversation,
  getConversations,
} from "../api/conversations";
import { getMessages } from "../api/messages";
import { createSocket } from "../api/socket";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import EmptyChat from "../components/chat/EmptyChat";

function Chat() {
  const { user, token, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [usersLoading, setUsersLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [usersError, setUsersError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [messageText, setMessageText] = useState("");

  const [socketConnected, setSocketConnected] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const [unreadCounts, setUnreadCounts] = useState({});

  // Store online user IDs.
  const [onlineUserIds, setOnlineUserIds] = useState(
    () => new Set()
  );

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeConversationIdRef = useRef(null);
  const selectionRequestRef = useRef(0);

  // Load contacts.
  useEffect(() => {
    if (!token) {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    let cancelled = false;

    async function loadUsers() {
      try {
        setUsersLoading(true);
        setUsersError("");

        const data = await getUsers(token);

        if (!cancelled) {
          setUsers(data.users ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setUsersError(
            error.message || "Failed to load contacts."
          );
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Load conversations.
  async function loadConversations() {
    if (!token) return;

    try {
      const data = await getConversations(token);

      setConversations(data.conversations ?? []);
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error.message
      );
    }
  }

  useEffect(() => {
    if (!token) {
      setConversations([]);
      return;
    }

    loadConversations();
  }, [token]);

  // Create Socket.IO connection and register listeners.
  useEffect(() => {
    if (!token) return;

    const socket = createSocket(token);

    socketRef.current = socket;

    // Socket connection established or re-established.
    function handleConnect() {
      console.log("Socket connected:", socket.id);

      setSocketConnected(true);

      // Rejoin the active conversation after reconnecting.
      const activeConversationId =
        activeConversationIdRef.current;

      if (activeConversationId) {
        socket.emit(
          "joinConversation",
          activeConversationId
        );
      }
    }

    function handleDisconnect() {
      console.log("Socket disconnected");

      setSocketConnected(false);
    }

    function handleConnectError(error) {
      console.error(
        "Socket connection error:",
        error.message
      );

      setSocketConnected(false);
    }

    // Receive the initial list of online user IDs.
    function handleOnlineUsers(userIds) {
      setOnlineUserIds(new Set(userIds.map(String)));
    }

    // A user came online.
    function handleUserOnline({ userId }) {
      if (!userId) return;

      setOnlineUserIds((previousIds) => {
        const nextIds = new Set(previousIds);
        nextIds.add(String(userId));
        return nextIds;
      });
    }

    // A user went offline.
    function handleUserOffline({ userId }) {
      if (!userId) return;

      setOnlineUserIds((previousIds) => {
        const nextIds = new Set(previousIds);
        nextIds.delete(String(userId));
        return nextIds;
      });
    }

    // Receive new messages.
    function handleNewMessage(newMessage) {
      const messageConversationId = String(
        newMessage.conversation?._id ??
          newMessage.conversation
      );

      // Update the sidebar preview and conversation ordering.
      setConversations((previousConversations) => {
        const exists = previousConversations.some(
          (item) =>
            String(item._id) === messageConversationId
        );

        // A conversation not in the current list may need
        // to be loaded from the API.
        if (!exists) {
          loadConversations();
          return previousConversations;
        }

        return previousConversations
          .map((item) => {
            if (String(item._id) !== messageConversationId) {
              return item;
            }

            return {
              ...item,
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt) -
              new Date(a.updatedAt)
          );
      });

      // Only update the message pane if this chat is open.
      if (
        messageConversationId !==
        String(activeConversationIdRef.current)
      ) {
        return;
      }

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (message) =>
            String(message._id) === String(newMessage._id)
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, newMessage].sort(
          (a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("newMessage", handleNewMessage);

    // If the socket is already connected, initialize state.
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("newMessage", handleNewMessage);

      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [token]);

  // Scroll to the newest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Select a contact and load their conversation.
  async function handleSelectUser(selected) {
    setShowContacts(false);
    setSearchTerm("");

    const requestId = ++selectionRequestRef.current;

    // Prevent messages from the previous chat appearing here.
    activeConversationIdRef.current = null;

    setSelectedUser(selected);
    setConversation(null);
    setMessages([]);
    setMessageError("");
    setMessageText("");
    setMessagesLoading(true);

    try {
      const conversationData = await createConversation(
        selected._id,
        token
      );

      // Ignore outdated requests when switching contacts quickly.
      if (requestId !== selectionRequestRef.current) {
        return;
      }

      const currentConversation =
        conversationData.conversation;

      const conversationId = String(
        currentConversation._id
      );

      activeConversationIdRef.current = conversationId;

      setConversation(currentConversation);

      if (socketRef.current?.connected) {
        socketRef.current.emit(
          "joinConversation",
          conversationId
        );
      }

      const messagesData = await getMessages(
        conversationId,
        token
      );

      if (requestId !== selectionRequestRef.current) {
        return;
      }

      // Merge history with any live messages received while loading.
      setMessages((previousMessages) => {
        const messagesById = new Map();

        for (const message of messagesData.messages ?? []) {
          messagesById.set(String(message._id), message);
        }

        for (const message of previousMessages) {
          messagesById.set(String(message._id), message);
        }

        return [...messagesById.values()].sort(
          (a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );
      });

      // Refresh the sidebar in case the conversation was just created.
      loadConversations();
    } catch (error) {
      if (requestId === selectionRequestRef.current) {
        setMessageError(
          error.message || "Could not open this conversation."
        );
      }
    } finally {
      if (requestId === selectionRequestRef.current) {
        setMessagesLoading(false);
      }
    }
  }

  // Send a message.
  function handleSendMessage() {
    const text = messageText.trim();

    if (!text || !conversation) return;

    if (!socketRef.current?.connected) {
      setMessageError(
        "Connection lost. Please wait for reconnection."
      );
      return;
    }

    const conversationId = String(conversation._id);

    setMessageError("");

    socketRef.current.emit(
      "sendMessage",
      {
        conversationId,
        text,
      },
      (response) => {
        // The user may have switched chats while waiting.
        if (
          activeConversationIdRef.current !== conversationId
        ) {
          return;
        }

        if (!response?.ok) {
          setMessageError(
            response?.error || "Message could not be sent."
          );
          return;
        }

        // Clear only if the user hasn't typed a newer message.
        setMessageText((currentText) =>
          currentText === text ? "" : currentText
        );

        loadConversations();
      }
    );
  }

  // Return to the sidebar on mobile.
  function handleBack() {
    setShowContacts(false);
    setSearchTerm("");

    selectionRequestRef.current += 1;
    activeConversationIdRef.current = null;

    setSelectedUser(null);
    setConversation(null);
    setMessages([]);
    setMessageError("");
    setMessageText("");
    setMessagesLoading(false);
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="flex h-full min-h-0 w-full overflow-hidden bg-slate-950">
        {/* Sidebar */}
        <ChatSidebar
          user={user}
          users={users}
          conversations={conversations}
          selectedUser={selectedUser}
          usersLoading={usersLoading}
          usersError={usersError}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectUser={handleSelectUser}
          onLogout={logout}
          onNewChat={setShowContacts}
          showContacts={showContacts}
          onlineUserIds={onlineUserIds}
        />

        {/* Chat area */}
        <main
          className={`min-h-0 min-w-0 flex-1 bg-[#090d16] ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? (
            <div className="flex min-h-0 w-full flex-col bg-[#090d16]">
              <ChatHeader
                user={selectedUser}
                connected={socketConnected}
                online={onlineUserIds.has(
                  String(selectedUser._id)
                )}
                onBack={handleBack}
              />

              <MessageList
                messages={messages}
                loading={messagesLoading}
                currentUserId={user?._id}
                messagesEndRef={messagesEndRef}
              />

              {messageError && (
                <div
                  role="alert"
                  className="shrink-0 border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-center text-xs text-rose-300 backdrop-blur-md animate-fade-in"
                >
                  {messageError}
                </div>
              )}

              <MessageInput
                value={messageText}
                onChange={setMessageText}
                onSend={handleSendMessage}
                connected={socketConnected}
              />
            </div>
          ) : (
            <EmptyChat />
          )}
        </main>
      </div>
    </div>
  );
}

export default Chat;