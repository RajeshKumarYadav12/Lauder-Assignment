import mongoose from "mongoose";

/**
 * EmailCapture Schema
 * Stores emails captured when users click "Get Tickets"
 */
const emailCaptureSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventUrl: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
emailCaptureSchema.index({ email: 1, eventId: 1 });
emailCaptureSchema.index({ createdAt: -1 });

const EmailCapture = mongoose.model("EmailCapture", emailCaptureSchema);

export default EmailCapture;
