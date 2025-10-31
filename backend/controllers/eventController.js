import Event from "../models/Event.js";

/**
 * Get all events
 * @route GET /api/events
 * @query {boolean} upcoming - Filter for upcoming events only
 * @query {number} limit - Limit number of results
 */
export const getAllEvents = async (req, res) => {
  try {
    const { upcoming, limit = 50 } = req.query;

    // Build query
    let query = { isActive: true };

    if (upcoming === "true") {
      query.date = { $gte: new Date() };
    }

    // Fetch events, sorted by date (earliest first)
    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

/**
 * Get single event by ID
 * @route GET /api/events/:id
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};

/**
 * Create new event (manual or from scraper)
 * @route POST /api/events
 */
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

/**
 * Update event
 * @route PUT /api/events/:id
 */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

/**
 * Delete event
 * @route DELETE /api/events/:id
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};
