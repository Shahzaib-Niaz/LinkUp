const express = require("express");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:conversationId", protect, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "fullName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(
      "Fetch messages failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
});

module.exports = router;