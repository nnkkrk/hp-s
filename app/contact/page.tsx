"use client";

import { useState } from "react";
import { FaInstagram, FaTwitter, FaDiscord, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-15">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* 📨 Left - Contact Info */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-[var(--accent)] mb-4">
            Contact Us
          </h1>
          <p className="text-[var(--muted)] leading-relaxed text-lg">
            Have a question, suggestion, or collaboration idea?  
            We’d love to hear from you — reach out via email or social media!
          </p>

          {/* ✉️ Email Highlight Box */}
          <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)] shadow-lg">
            <p className="text-lg text-[var(--muted)] mb-2">
              You can directly email us at:
            </p>
            <a
              href="mailto:zyronix.innovations@gmail.com"
              className="text-xl font-semibold text-[var(--accent)] hover:underline break-all"
            >
              zynx.anime@gmail.com
            </a>
          </div>

          {/* 🌐 Social Links */}
          <div className="flex gap-5 mt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://discord.gg"
              target="_blank"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <FaDiscord size={24} />
            </a>
            <a
              href="mailto:zynx.anime@gmail.com"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>

        {/* 🗺️ Right - Map */}
        <div className="flex-1 h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
          <iframe
            title="Zyronix Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d367144.18514800455!2d77.3507349913945!3d28.63530884925121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d032d37b1b7e9%3A0xf95cb0af544e3a5d!2sIndia!5e0!3m2!1sen!2sin!4v1697641137830!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* ✅ Footer Message */}
      <div className="mt-16 text-center text-[var(--muted)] text-sm">
        <p>We usually reply within 24 hours ✨</p>
      </div>
    </main>
  );
}
