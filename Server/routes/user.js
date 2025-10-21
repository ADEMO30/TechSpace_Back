const express = require("express");
const { register, login } = require("../controllers/user");
const {
  registerValidation,
  validation,
  loginValidation,
} = require("../midlleware/validation");
const isAuth = require("../midlleware/isAuth");
const isAdmin = require("../midlleware/isAdmin");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/signup", registerValidation(), validation, register);

// Login
router.post("/login", loginValidation(), validation, login);

// Current user info (protected)
router.get("/current", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User  not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin-only route 
router.get("/admin-only-route", isAuth, isAdmin, (req, res) => {
  res.json({ msg: "Welcome admin! This is a protected route." });
});

// Get all users (admin only)
router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch users", error: error.message });
  }
});

// Delete user by ID (admin only)
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete user", error: error.message });
  }
});


module.exports = router;