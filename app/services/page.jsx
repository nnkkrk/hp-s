"use client";

import { motion } from "framer-motion";
import {
  FiUsers,
  FiGlobe,
  FiZap,
  FiCode,
  FiExternalLink,
  FiShield,
  FiTrendingUp
} from "react-icons/fi";

export default function ServicesPage() {
  const whatsappLink = "https://wa.me/919178521537";

  const services = [
    {
      title: "Reseller Program",
      desc: "Deploy into the market as a verified reseller. Access elite rates with high-margin profit protocols.",
      icon: FiUsers,
      badge: "Available",
      status: "Cheapest",
      active: true,
      tag: "COMMERCIAL"
    },
    {
      title: "Whitelabel Assets",
      desc: "Acquire your own branded domain. Fully integrated topup systems under your own operational identity.",
      icon: FiGlobe,
      badge: "Available",
      status: "Verified",
      active: true,
      tag: "PLATFORM"
    },
    {
      title: "Custom Infrastructure",
      desc: "Tailor-made topup architecture designed for specific business operational requirements.",
      icon: FiZap,
      badge: "Available",
      status: "Specialized",
      active: true,
      tag: "DEVELOPMENT"
    },
    {
      title: "API Integration",
      desc: "Direct socket connections for automated service delivery across your existing digital network.",
      icon: FiCode,
      badge: "Coming Soon",
      status: "Development",
      active: false,
      tag: "PROTOCOLS"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-3"
          >
            Our Services
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--muted)] text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Reliable infrastructure and commercial solutions to expand your digital network presence effectively.
          </motion.p>
        </div>

        {/* SERVICES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2"
        >
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={service.active ? { y: -5 } : {}}
                onClick={() => service.active && window.open(whatsappLink, "_blank")}
                className={`relative group p-8 rounded-3xl border transition-all duration-500 overflow-hidden backdrop-blur-md
                ${service.active
                    ? "cursor-pointer bg-[var(--card)]/40 border-[var(--border)]/60 hover:border-[var(--accent)]/50 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
                    : "opacity-60 cursor-not-allowed bg-[var(--card)]/20 border-[var(--border)]/20"
                  }`}
              >
                {/* SCANLINE EFFECT */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] z-0 bg-[length:100%_4px] pointer-events-none opacity-20" />

                {/* TAG & STATUS */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--muted)]">{service.tag}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest
                    ${service.active
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]"
                      : "bg-white/5 text-[var(--muted)] border-white/10"
                    }`}>
                    {service.status}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500
                    ${service.active
                      ? "bg-black/20 border-white/5 text-[var(--accent)] group-hover:scale-110 group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]"
                      : "bg-white/5 border-white/5 text-[var(--muted)]"
                    }`}>
                    <Icon size={28} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
                      {service.title}
                      {service.active && <FiExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]" />}
                    </h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                      {service.desc}
                    </p>

                    {service.active ? (
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--accent)]">
                        <span className="group-hover:mr-2 transition-all">Establish Connection</span>
                        <FiExternalLink size={12} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] opacity-50">
                        <span>Offline</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DECORATIVE CORNER BRACKETS */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/5 group-hover:border-[var(--accent)]/20 transition-colors" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/5 group-hover:border-[var(--accent)]/20 transition-colors" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* TRUST INDICATORS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-10 border-t border-[var(--border)]/30 grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          <TrustMark icon={FiShield} label="SECURE PROTOCOL" desc="Encrypted transactions and data sovereignty." />
          <TrustMark icon={FiZap} label="INSTANT ACTIVATION" desc="Rapid deployment of service nodes." />
          <TrustMark icon={FiTrendingUp} label="MARKET ADVANTAGE" desc="Dominant rates in current network sectors." />
        </motion.div>

      </div>

      {/* FIXED OVERLAY SCANLINE */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-50 bg-[length:100%_4px] pointer-events-none opacity-10" />
    </div>
  );
}

function TrustMark({ icon: Icon, label, desc }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)] mb-4">
        <Icon size={20} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h4>
      <p className="text-[10px] text-[var(--muted)] leading-relaxed uppercase">{desc}</p>
    </div>
  );
}
