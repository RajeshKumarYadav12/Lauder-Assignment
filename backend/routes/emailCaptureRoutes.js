import express from "express";
import {
  captureEmail,
  getAllEmailCaptures,
  getEmailCapturesByEvent,
} from "../controllers/emailCaptureController.js";

const router = express.Router();

/**
 * Email Capture Routes
 * Base path: /api/email-capture
 */

// POST - Capture email when user clicks "Get Tickets"
router.post("/", captureEmail);

// GET - Get all email captures (admin)
router.get("/", getAllEmailCaptures);

// GET - Get email captures for specific event
router.get("/event/:eventId", getEmailCapturesByEvent);

export default router;
