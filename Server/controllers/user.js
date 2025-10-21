const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check for existing user
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      console.log(`Register failed: Email already exists - ${email}`);
      return res.status(400).json({ msg: "Email already exists. Try another." });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser  = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser .save();

    // Generate token
    const token = jwt.sign(
      { id: newUser ._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Returning user (without passW)
    const { password: _, ...userWithoutPassword } = newUser ._doc;

    console.log(`Register success: User created - ${email}`);

    res.status(200).json({
      msg: "Registered successfully.",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ msg: "Server error. Cannot register.", error: error.message });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found - ${email}`);
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password - ${email}`);
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Include role in token payload
    const token = jwt.sign(
      { id: user._id, role: user.role },  
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    console.log(`Login success: User logged in - ${email} with role ${user.role}`);

    res.status(200).json({
      msg: "Logged in successfully.",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ msg: "Server error. Cannot login.", error: error.message });
  }
};