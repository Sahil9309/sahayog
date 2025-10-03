// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const multer = require("multer");

// Configure multer for avatar uploads
const upload = multer({ dest: "uploads/" });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authenticateToken, getProfile); // Protected route

// Settings endpoints
router.put(
  "/update-profile",
  authenticateToken,
  upload.single("avatar"),
  updateProfile,
);
router.post("/change-password", authenticateToken, changePassword);

module.exports = router;
