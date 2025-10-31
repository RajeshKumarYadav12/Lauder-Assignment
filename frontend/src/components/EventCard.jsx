import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

/**
 * EventCard Component
 * Displays individual event with image, details, and Get Tickets button
 */
const EventCard = ({ event, onGetTickets }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-AU", options);
  };

  // Truncate description
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="card overflow-hidden group animate-fade-in hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden cursor-pointer flex-shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
          }}
        />
        {/* Source Badge */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-lg uppercase tracking-wide">
          {event.source || "Featured"}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Event Details */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-start gap-2 mb-2 text-gray-600">
          <FaCalendarAlt className="mt-1 text-primary-500 flex-shrink-0" />
          <span className="text-sm font-medium">{formatDate(event.date)}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-4 text-gray-600">
          <FaMapMarkerAlt className="mt-1 text-primary-500 flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {truncateText(event.description)}
        </p>

        {/* Get Tickets Button */}
        <button
          onClick={() => onGetTickets(event)}
          className="w-full btn-primary text-center group-hover:shadow-2xl mt-auto"
        >
          Get Tickets 🎟️
        </button>
      </div>
    </div>
  );
};

export default EventCard;
