const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContributionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card',
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Index for efficient queries
ContributionSchema.index({ userId: 1, createdAt: -1 });
ContributionSchema.index({ eventId: 1, createdAt: -1 });
ContributionSchema.index({ transactionId: 1 });

const ContributionModel = mongoose.model('Contribution', ContributionSchema);

module.exports = ContributionModel;