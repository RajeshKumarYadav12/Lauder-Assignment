import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

/**
 * Event Routes
 * Base path: /api/events
 */

// GET all events and CREATE new event
router.route("/").get(getAllEvents).post(createEvent);

// GET, UPDATE, DELETE single event by ID
router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

export default router;
