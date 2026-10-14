
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app");
const Message = require("./models/Message");
const socketAuth = require("./middleware/socketAuth.middleware");
const Conversation = require("./models/Conversation");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Track active sockets for each user.
// Map: userId -> Set of socket IDs
const onlineUsers = new Map();

// Socket authentication
io.use(socketAuth);

io.on("connection", (socket) => {
  const userId = String(socket.user._id);

  console.log("A user connected:", socket.id);

  // Check whether this is the user's first active connection.
  let userSockets = onlineUsers.get(userId);
  const isFirstConnection = !userSockets;

  if (!userSockets) {
    userSockets = new Set();
    onlineUsers.set(userId, userSockets);
  }

  userSockets.add(socket.id);

  // Send the current online-user list to this client.
  socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

  // Notify everyone only when the user first comes online.
  if (isFirstConnection) {
    io.emit("userOnline", { userId });
  }

  // Join a conversation after checking membership.
  socket.on("joinConversation", async (conversationId) => {
    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
      });

      if (!conversation) {
        console.log(
          `${socket.user.fullName} is not allowed to join ${conversationId}`
        );
        return;
      }

      socket.join(String(conversation._id));

      console.log(
        `${socket.user.fullName} joined conversation: ${conversationId}`
      );
    } catch (error) {
      console.error("Join conversation failed:", error.message);
    }
  });

  // Send message
  socket.on("sendMessage", async (message, acknowledge) => {
    try {
      const conversationId = message?.conversationId;

      const text =
        typeof message?.text === "string"
          ? message.text.trim()
          : "";

      if (!conversationId || !text) {
        return acknowledge?.({
          ok: false,
          error: "Conversation and message text are required.",
        });
      }

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
      });

      if (!conversation) {
        return acknowledge?.({
          ok: false,
          error: "You cannot send messages to this conversation.",
        });
      }

      const savedMessage = await Message.create({
        conversation: conversation._id,
        sender: socket.user._id,
        text,
      });

      await Conversation.findByIdAndUpdate(conversation._id, {
        updatedAt: new Date(),
      });

      const populatedMessage = await savedMessage.populate(
        "sender",
        "fullName avatar"
      );

      io.to(String(conversation._id)).emit(
        "newMessage",
        populatedMessage
      );

      return acknowledge?.({
        ok: true,
        message: populatedMessage,
      });
    } catch (error) {
      console.error("Message save failed:", error.message);

      return acknowledge?.({
        ok: false,
        error: "Message could not be saved.",
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userSockets = onlineUsers.get(userId);

    if (userSockets) {
      userSockets.delete(socket.id);

      // Mark offline only after the last connection closes.
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);

        io.emit("userOffline", { userId });
      }
    }

    console.log("A user disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`LinkUp server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });