const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: {
        $ne: req.user._id,
      },
    })
      .select("fullName email avatar")
      .sort({ fullName: 1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Fetch users failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;