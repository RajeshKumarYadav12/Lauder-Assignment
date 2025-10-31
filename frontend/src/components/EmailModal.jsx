import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { emailCaptureAPI } from "../services/api";

/**
 * EmailModal Component
 * Modal to collect user email before redirecting to event site
 */
const EmailModal = ({ isOpen, onClose, event }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Validate email
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting email capture process...");
      
      // Try to save email to backend database (optional - won't fail if backend is down)
      if (emailCaptureAPI && event._id) {
        try {
          console.log("📡 Attempting to save to backend...");
          await emailCaptureAPI.captureEmail({
            email: email,
            eventId: event._id,
            eventTitle: event.title,
            eventUrl: event.url,
          });
          console.log("✅ Email saved to database");
        } catch (apiError) {
          console.warn(
            "⚠️ Backend not available, continuing with localStorage...",
            apiError.message
          );
          // Don't throw - continue with localStorage
        }
      }

      // Store email in localStorage (always works)
      try {
        console.log("💾 Saving to localStorage...");
        const userEmails = JSON.parse(localStorage.getItem("userEmails") || "[]");
        if (!userEmails.includes(email)) {
          userEmails.push(email);
          localStorage.setItem("userEmails", JSON.stringify(userEmails));
        }

        // Store event interest with more details
        const eventInterests = JSON.parse(
          localStorage.getItem("eventInterests") || "[]"
        );
        eventInterests.push({
          eventId: event._id || Date.now(),
          eventTitle: event.title,
          eventUrl: event.url,
          email: email,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("eventInterests", JSON.stringify(eventInterests));
        console.log("✅ Saved to localStorage");
      } catch (storageError) {
        console.warn("⚠️ localStorage not available:", storageError.message);
        // Continue anyway
      }

      // Log for debugging
      console.log("📧 Email captured:", email);
      console.log("🎟️ Event:", event.title);
      console.log("🔗 URL:", event.url);

      // Wait a bit to show submitting state
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validate and redirect to event URL
      if (event?.url && typeof event.url === 'string' && event.url.startsWith("http")) {
        console.log("✅ Valid URL, redirecting...");
        // Open in new tab
        const newWindow = window.open(
          event.url,
          "_blank",
          "noopener,noreferrer"
        );
        
        // Show success message
        setTimeout(() => {
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            // Popup blocked, show message
            alert(
              `Thank you ${email}! We're opening ${event.title}. If a new tab didn't open, please check your popup blocker.`
            );
          }
        }, 100);
      } else {
        // If no valid URL, show message
        console.log("⚠️ No valid URL, showing message");
        alert(
          `Thank you! Your email (${email}) has been registered for "${event.title}". You'll receive ticket details soon.`
        );
      }

      // Close modal and reset
      handleClose();
    } catch (err) {
      console.error("❌ Error in handleSubmit:", err);
      console.error("Error stack:", err.stack);
      setError(`Error: ${err.message || "Something went wrong. Please try again."}`);
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setEmail("");
    setError("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          disabled={isSubmitting}
        >
          <FaTimes size={24} />
        </button>

        {/* Modal Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Get Your Tickets! 🎉
          </h2>
          <p className="text-gray-600">
            Enter your email to continue to{" "}
            <span className="font-semibold">{event.title}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="input-field"
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-secondary cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          We'll only use your email to improve your experience. We never spam.
        </p>
      </div>
    </div>
  );
};

export default EmailModal;
