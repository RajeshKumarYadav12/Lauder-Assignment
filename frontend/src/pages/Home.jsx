import React, { useState, useMemo } from "react";
import EventCard from "../components/EventCard";
import EmailModal from "../components/EmailModal";
import Stats from "../components/Stats";
import useFetchEvents from "../hooks/useFetchEvents";
import {
  FaCalendarAlt,
  FaSearch,
  FaSync,
  FaFilter,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

/**
 * Home Page Component
 * Main landing page displaying all events
 */
const Home = () => {
  const { events, loading, error, refetch } = useFetchEvents(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, title
  const [showFilters, setShowFilters] = useState(false);

  // Handle Get Tickets button click
  const handleGetTickets = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Get unique sources from events
  const sources = useMemo(() => {
    const sourceSet = new Set(events.map((e) => e.source));
    return ["all", ...Array.from(sourceSet)];
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource =
        selectedSource === "all" || event.source === selectedSource;

      return matchesSearch && matchesSource;
    });

    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [events, searchTerm, selectedSource, sortBy]);

  // Count events by source
  const sourceCounts = useMemo(() => {
    const counts = {};
    events.forEach((event) => {
      counts[event.source] = (counts[event.source] || 0) + 1;
    });
    return counts;
  }, [events]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                🔴 Live Event Data from Sydney
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Sydney's Best Events
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Automatically updated from Eventbrite, TimeOut, Eventfinda, and
              more. Find and book amazing experiences happening in Sydney,
              Australia 🇦🇺
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <FaCalendarAlt size={20} />
                <span className="font-semibold">
                  {events.length}+ Live Events
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <FaMapMarkerAlt size={20} />
                <span>Sydney, NSW</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <FaClock size={20} />
                <span>Updated Every 6 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-sm py-6 sticky top-16 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 lg:flex-none btn-secondary flex items-center justify-center gap-2 cursor-pointer ${
                  showFilters ? "bg-primary-50 border-primary-300" : ""
                }`}
              >
                <FaFilter />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={refetch}
                className="flex-1 lg:flex-none btn-secondary flex items-center justify-center gap-2 cursor-pointer"
                disabled={loading}
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Source
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source === "all"
                          ? "All Sources"
                          : source.charAt(0).toUpperCase() + source.slice(1)}
                        {source !== "all" && ` (${sourceCounts[source] || 0})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="date">Date (Earliest First)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Summary */}
              <div className="mt-3 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-primary-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedSource !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Source: {selectedSource}
                    <button
                      onClick={() => setSelectedSource("all")}
                      className="hover:text-primary-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-gray-600 text-sm">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredEvents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{events.length}</span>{" "}
            events
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section id="events" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Section - Show only when not loading and has events */}
          {!loading && !error && events.length > 0 && (
            <div className="mb-12">
              <Stats events={events} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="spinner mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing events...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 text-lg font-semibold mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={refetch} className="btn-primary cursor-pointer">
                Try Again
              </button>
            </div>
          )}

          {/* No Events State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back soon for new events!"}
              </p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event._id || index}
                  event={event}
                  onGetTickets={handleGetTickets}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Email Modal */}
      {selectedEvent && (
        <EmailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default Home;
