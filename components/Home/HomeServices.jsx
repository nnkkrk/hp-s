"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function HomeServices() {
  return (
    <section className="py-6 px-4 bg-[var(--background)] border-y border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 shadow-sm">

        <div className="text-center sm:text-left">
          <h3 className="text-sm font-black uppercase text-amber-500 italic tracking-tighter">
            Build Your Website
          </h3>
          <p className="text-[10px] text-[var(--muted)] font-medium">
            We provide all kinds of software development and website services.
          </p>
        </div>

        <motion.a
          href="https://wa.me/919178521537"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-black hover:bg-amber-600 transition-all font-black text-[10px] uppercase tracking-widest"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaWhatsapp size={14} />
          <span>Contact Us</span>
        </motion.a>

      </div>
    </section>
  );
}
