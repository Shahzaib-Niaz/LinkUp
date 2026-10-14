const express = require("express");

const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Message = require("../models/Message");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        message: "Participant ID is required",
      });
    }

    if (participantId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    const participant = await User.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, participantId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          req.user._id,
          participantId,
        ],
      });
    }

    await conversation.populate(
      "participants",
      "fullName email avatar"
    );

    res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error(
      "Conversation creation failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create conversation",
    });
  }
});



router.get("/", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate(
        "participants",
        "fullName email avatar"
      )
      .sort({ updatedAt: -1 });

    const conversationsWithLastMessage =
      await Promise.all(
        conversations.map(async (conversation) => {
          const lastMessage = await Message.findOne({
            conversation: conversation._id,
          })
            .sort({ createdAt: -1 })
            .select("text createdAt sender");

          return {
            ...conversation.toObject(),
            lastMessage,
          };
        })
      );

    res.status(200).json({
      conversations: conversationsWithLastMessage,
    });
  } catch (error) {
    console.error(
      "Fetch conversations failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
});


module.exports = router;