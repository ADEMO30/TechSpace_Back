const jwt = require("jsonwebtoken");
const Users = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
    // Check that secret key is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Throw error or send a clear message
      return res.status(500).send({ msg: "Server error: JWT secret is not defined" });
    }

    // Get token from headers (usually in format "Bearer <token>")
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({ msg: "Not authorized !!" });
    }

    // Usually token is in the form: "Bearer <token>", so split it
    const token = authHeader.split(" ")[1]; // safer extraction of token
    if (!token) {
      return res.status(401).send({ msg: "Not authorized !!" });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, secret);

    // Find user from decoded token id
    const foundUser = await Users.findById(decoded.id);
    if (!foundUser) {
      return res.status(401).send({ msg: "Not authorized !!" });
    }

    // Attach user to request object
    req.user = foundUser;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send({ msg: "Not authorized !!" });
  }
};

module.exports = isAuth;
