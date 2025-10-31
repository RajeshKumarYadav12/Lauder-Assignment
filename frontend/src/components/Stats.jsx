import React from "react";
import {
  FaFire,
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

/**
 * Stats Component
 * Displays key statistics about events
 */
const Stats = ({ events }) => {
  // Calculate stats
  const totalEvents = events.length;

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= weekFromNow;
  }).length;

  const uniqueLocations = new Set(events.map((e) => e.location)).size;

  const stats = [
    {
      icon: <FaFire className="text-orange-500" />,
      label: "Total Events",
      value: totalEvents,
      color: "orange",
    },
    {
      icon: <FaCalendarCheck className="text-green-500" />,
      label: "This Week",
      value: thisWeekEvents,
      color: "green",
    },
    {
      icon: <FaClock className="text-blue-500" />,
      label: "Today",
      value: todayEvents,
      color: "blue",
    },
    {
      icon: <FaMapMarkedAlt className="text-purple-500" />,
      label: "Locations",
      value: uniqueLocations,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl">{stat.icon}</div>
            <div className={`text-3xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
