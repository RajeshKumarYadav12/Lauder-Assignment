import mongoose from "mongoose";

/**
 * Event Schema
 * Represents an event scraped from external sources
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    url: {
      type: String,
      required: [true, "Event URL is required"],
    },
    source: {
      type: String,
      enum: ["eventbrite", "meetup", "manual"],
      default: "manual",
    },
    externalId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ externalId: 1 });

// Virtual for checking if event is upcoming
eventSchema.virtual("isUpcoming").get(function () {
  return this.date > new Date();
});

// Ensure virtuals are included when converting to JSON
eventSchema.set("toJSON", { virtuals: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
