const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
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
  tags: [{
    type: String,
    trim: true,
  }],
  uploadedImage: {
    type: String, // Path to locally uploaded image file
  },
  imageUrl: {
    type: String, // URL link to external image
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
}, { timestamps: true });

const EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;