"use client";

import { useState } from "react";
import { sendContactMessage } from "@/lib/portfolio-api";

export default function ContactTab({ onShowToast }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      if (onShowToast) {
        onShowToast("Your message has been sent successfully.");
      }

      setTimeout(() => {
        setSubmitted(false);
      }, 8000);
    } catch (err) {
      const msg = err?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
      if (onShowToast) {
        onShowToast(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight mb-2">
          Contact
        </h1>
        <p className="text-[14.5px] text-gray-600 leading-relaxed">
          For regulatory guidance (IND / NDA / BLA), allometric scaling advisory, or academic
          collaboration inquiries:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
        <div className="md:col-span-5 space-y-4 text-xs text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Office Location</h4>
            <p>Mahmood Clinical Pharmacology Consultancy, LLC</p>
            <p>Rockville, Maryland, USA</p>
          </div>
        </div>

        <div className="md:col-span-7">
          {/* In-page Success Alert Notification */}
          {submitted && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center space-x-3 shadow-sm transition-all duration-300 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-emerald-950 font-semibold text-sm">
                  Your message has been sent successfully.
                </p>
              </div>
            </div>
          )}

          {/* In-page Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start space-x-3 shadow-sm transition-all duration-300 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-700 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-rose-950 text-sm">Error Sending Message</h4>
                <p className="text-rose-800 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Your Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                placeholder="john.smith@organization.org"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Sending..." : "Send Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
