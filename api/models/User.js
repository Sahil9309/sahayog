const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // Optional field for the user's avatar URL
    },
    avatarPublicId: {
      type: String, // Cloudinary public ID for avatar deletion
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
