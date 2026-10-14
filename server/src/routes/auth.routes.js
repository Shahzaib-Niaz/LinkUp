
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect=require("../middleware/auth.middleware")
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    //  Validate required fields
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    //  Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    //  Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    //  Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create the user in MongoDB
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    //  Return safe user information only
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});




// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Validate input
    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    //  Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    //  Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //  Compare entered password with stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // create jwt token
    const token=jwt.sign(
        {userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )

    //  Login successful
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});



// test
router.get("/me",protect,(req,res)=>{
  res.status(200).json({
    user:req.user
  })
})



module.exports = router;