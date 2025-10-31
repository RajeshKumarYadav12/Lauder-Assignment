import EmailCapture from "../models/EmailCapture.js";

/**
 * Capture email when user clicks "Get Tickets"
 * @route POST /api/email-capture
 */
export const captureEmail = async (req, res) => {
  try {
    const { email, eventId, eventTitle, eventUrl } = req.body;

    // Validate required fields
    if (!email || !eventId || !eventTitle || !eventUrl) {
      return res.status(400).json({
        success: false,
        message: "Email, eventId, eventTitle, and eventUrl are required",
      });
    }

    // Get user agent and IP (optional)
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip || req.connection.remoteAddress || "";

    // Create email capture record
    const emailCapture = await EmailCapture.create({
      email,
      eventId,
      eventTitle,
      eventUrl,
      userAgent,
      ipAddress,
    });

    res.status(201).json({
      success: true,
      message: "Email captured successfully",
      data: {
        id: emailCapture._id,
        email: emailCapture.email,
        eventTitle: emailCapture.eventTitle,
      },
    });
  } catch (error) {
    console.error("Error capturing email:", error);

    // Handle duplicate email for same event
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Email already registered for this event",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error capturing email",
      error: error.message,
    });
  }
};

/**
 * Get all captured emails (admin only)
 * @route GET /api/email-capture
 */
export const getAllEmailCaptures = async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;

    const captures = await EmailCapture.find()
      .populate("eventId", "title date location")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await EmailCapture.countDocuments();

    res.status(200).json({
      success: true,
      count: captures.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: captures,
    });
  } catch (error) {
    console.error("Error fetching email captures:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching email captures",
      error: error.message,
    });
  }
};

/**
 * Get email captures for specific event
 * @route GET /api/email-capture/event/:eventId
 */
export const getEmailCapturesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const captures = await EmailCapture.find({ eventId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: captures.length,
      data: captures,
    });
  } catch (error) {
    console.error("Error fetching email captures:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching email captures",
      error: error.message,
    });
  }
};
