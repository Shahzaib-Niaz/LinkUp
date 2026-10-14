import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

const conversationId = "6ac41d2b327d9dabfce4e799";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch previous messages from MongoDB
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/messages/${conversationId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        const formattedMessages = data.messages.map((message) => ({
          id: message._id,
          text: message.text,
          senderInfo: message.sender,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }

    fetchMessages();
  }, []);

  // Socket.IO connection and real-time messages
  useEffect(() => {
    function handleConnect() {
      console.log("User connected:", socket.id);

      socket.emit("joinConversation", conversationId);
    }

    function handleNewMessage(message) {
      console.log("New Message:", message);

      setMessages((prev) => [
        ...prev,
        {
          id: message._id,
          text: message.text,
          senderInfo: message.sender,
        },
      ]);
    }

    function handleConnectError(error) {
      console.error(
        "Socket authentication failed:",
        error.message
      );
    }

    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  function handleSendMessage(e) {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit("sendMessage", {
      text: message,
      conversationId,
    });

    setMessage("");
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 p-5">
          <h1 className="text-2xl font-bold text-indigo-600">
            LinkUp
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Stay connected
          </p>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 p-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Ali</p>

              <p className="truncate text-sm text-slate-500">
                {messages.length > 0
                  ? messages[messages.length - 1].text
                  : "No messages yet"}
              </p>
            </div>

            <span className="text-xs text-slate-400">
              Now
            </span>
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
            A
          </div>

          <div>
            <h2 className="font-semibold">Ali</h2>

            <p className="text-xs text-emerald-600">
              Conversation
            </p>
          </div>
        </header>

        {/* Messages */}
        <section className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm md:max-w-[65%]">
                {msg.text}
              </div>
            </div>
          ))}
        </section>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-slate-200 bg-white p-3 md:p-4"
        >
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
            >
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;

