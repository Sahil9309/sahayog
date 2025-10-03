const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    amountToRaise: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Legacy fields for backward compatibility
    imageUrl: {
      type: String, // Cloudinary URL or external image URL
    },
    imagePublicId: {
      type: String, // Cloudinary public ID for deletion
    },
    // New multiple images support
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        isStarred: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const EventModel = mongoose.model("Event", EventSchema);

module.exports = EventModel;
