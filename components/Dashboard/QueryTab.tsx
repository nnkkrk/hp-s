"use client";

import { JSX, useState } from "react";
import {
  FaPhoneAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMessageSquare, FiInfo, FiCheckCircle, FiAlertCircle, FiZap } from "react-icons/fi";

/* ===================== ENV ===================== */

const SUPPORT_CONFIG = {
  header: {
    title: process.env.NEXT_PUBLIC_SUPPORT_TITLE || "Support Center",
    subtitle: process.env.NEXT_PUBLIC_SUPPORT_SUBTITLE || "Our dedicated support team is here to assist you with any questions or issues.",
  },

  contacts: {
    title: "Direct Channels",
    items: [
      {
        id: "phone",
        title: "Support Line",
        value: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
        href: process.env.NEXT_PUBLIC_SUPPORT_PHONE_TEL,
        icon: "phone",
        color: "blue",
      },
      {
        id: "instagram",
        title: "Instagram",
        value: process.env.NEXT_PUBLIC_SUPPORT_INSTAGRAM_LABEL,
        href: process.env.NEXT_PUBLIC_SUPPORT_INSTAGRAM_URL,
        icon: "instagram",
        color: "pink",
      },
      {
        id: "whatsapp",
        title: "Community",
        value: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_LABEL,
        href: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL,
        icon: "whatsapp",
        color: "green",
      },
    ].filter((item) => item.value && item.href),
  },

  queryTypes: [
    "Order Issue",
    "Payment Issue",
    "Wallet Issue",
    "General Inquiry",
    "Bug Report",
    "Feedback",
  ],
};

/* ===================== ICON MAP ===================== */

const ICON_MAP: Record<string, JSX.Element> = {
  phone: <FaPhoneAlt />,
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
};

const FAQS = [
  { question: "When will my order be completed?", answer: "Most orders are processed within 5-15 minutes. Heavy server traffic might take up to 2 hours." },
  { question: "How do I top up my wallet?", answer: "Go to the Wallet section, enter the amount, select UPI, and complete the payment on the gateway." },
  { question: "Is my payment secure?", answer: "Yes, we use industry-standard encrypted payment gateways to ensure your data is always safe." },
];

/* ===================== COMPONENT ===================== */

export default function QueryTab() {
  const [queryType, setQueryType] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!queryType || !queryMessage.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedPhone = localStorage.getItem("phone");

    try {
      const res = await fetch("/api/support/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: storedEmail || null,
          phone: storedPhone || null,
          type: queryType,
          message: queryMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", message: "Your query has been submitted. We'll get back to you soon!" });
        setQueryType("");
        setQueryMessage("");
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Help & <span className="text-[var(--accent)]">Support</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
          {SUPPORT_CONFIG.header.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* LEFT: FORM & FAQS */}
        <div className="lg:col-span-3 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <FiMessageSquare className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">New Support Ticket</h3>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${status.type === "success"
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                >
                  {status.type === "success" ? <FiCheckCircle className="shrink-0 text-xl" /> : <FiAlertCircle className="shrink-0 text-xl" />}
                  <p className="text-sm font-bold">{status.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] ml-1">Case Type</label>
                <div className="relative">
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] 
                               focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all
                               appearance-none cursor-pointer font-bold text-sm"
                  >
                    <option value="">Select Topic</option>
                    {SUPPORT_CONFIG.queryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] ml-1">Description</label>
                <textarea
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  placeholder="Describe your issue..."
                  className="w-full h-32 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] 
                             focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all
                             resize-none font-medium text-sm"
                />
              </div>

              <button
                disabled={!queryType || !queryMessage.trim() || isSubmitting}
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold uppercase tracking-wider text-xs
                           flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/20
                           hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 
                           disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Query</span>
                    <FiSend size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* FAQ SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <FiInfo className="text-lg" />
              </div>
              <h3 className="text-xl font-bold italic tracking-tight uppercase">FAQs</h3>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/30 overflow-hidden backdrop-blur-sm"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--card)] transition-colors"
                  >
                    <span className="text-sm font-bold tracking-tight">{faq.question}</span>
                    <FiCheckCircle className={`transition-transform duration-300 ${activeFaq === idx ? "rotate-180 text-[var(--accent)]" : "text-[var(--muted)]"}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="p-4 pt-0 text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border)]/30 mt-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: CONTACT SECTIONS */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <FiInfo className="text-xl" />
              </div>
              <h3 className="text-lg font-bold uppercase">{SUPPORT_CONFIG.contacts.title}</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SUPPORT_CONFIG.contacts.items.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 
                             hover:bg-[var(--card)] hover:border-[var(--accent)]/30 transition-all 
                             flex items-center gap-4 shadow-sm"
                >
                  <div className={`p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-xl transition-all duration-300`}>
                    {ICON_MAP[item.icon]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] mb-0.5">{item.title}</p>
                    <p className="text-sm font-bold text-[var(--foreground)] truncate font-mono">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Tip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group/tip"
          >
            <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-wider mb-2">
              <FiZap /> Tip
            </h4>
            <p className="text-xs font-bold text-[var(--foreground)] leading-relaxed mb-4">
              Include your Order ID in the description for faster resolution.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
