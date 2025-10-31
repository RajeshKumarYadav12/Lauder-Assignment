import { useState, useEffect } from "react";
import { eventAPI } from "../services/api";

/**
 * Custom hook to fetch events from API
 * @param {boolean} upcomingOnly - Fetch only upcoming events
 * @returns {object} { events, loading, error, refetch }
 */
const useFetchEvents = (upcomingOnly = true) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = upcomingOnly
        ? await eventAPI.getUpcomingEvents()
        : await eventAPI.getAllEvents();

      if (response.success) {
        setEvents(response.data);
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [upcomingOnly]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};

export default useFetchEvents;
