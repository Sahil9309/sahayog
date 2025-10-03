// controllers/auth.controller.js

const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

// POST /register
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  try {
    const userDoc = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      avatar,
    });
    res.status(201).json(userDoc);
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
};

// POST /login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        },
      );
    } else {
      res.status(422).json("Password not correct");
    }
  } else {
    res.status(404).json("User not found");
  }
};

// GET /profile
const getProfile = async (req, res) => {
  // req.user is attached by the authenticateToken middleware
  const { id } = req.user;
  try {
    const userDoc = await User.findById(id);
    if (userDoc) {
      res.json({
        _id: userDoc._id,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        email: userDoc.email,
        avatar: userDoc.avatar,
      });
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// POST /logout
const logoutUser = (req, res) => {
  res.cookie("token", "").json(true);
};

// PUT /auth/update-profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { firstName, lastName, username } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;

    // Handle avatar upload
    if (req.file) {
      const cloudinary = require("../config/cloudinary.js");
      const fs = require("fs");

      try {
        // Get current user to delete old avatar
        const currentUser = await User.findById(id);

        // Delete old avatar from Cloudinary if it exists
        if (currentUser.avatarPublicId) {
          await cloudinary.uploader.destroy(currentUser.avatarPublicId);
        }

        // Upload new avatar
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sahayog-avatars",
          resource_type: "image",
          transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        updateData.avatar = result.secure_url;
        updateData.avatarPublicId = result.public_id;

        // Clean up temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error("Failed to clean up temp file:", cleanupError);
          }
        }
        return res
          .status(422)
          .json({ error: "Avatar upload failed. Please try again." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    // Clean up temporary file if it exists
    if (req.file && req.file.path) {
      try {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up temp file:", cleanupError);
      }
    }

    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(422).json({ error: "Username already exists" });
    }

    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// POST /auth/change-password
const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = bcrypt.compareSync(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password and update
    const hashedNewPassword = bcrypt.hashSync(newPassword, bcryptSalt);
    await User.findByIdAndUpdate(id, { password: hashedNewPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateProfile,
  changePassword,
};
