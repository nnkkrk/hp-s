"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaIdCard,
  FaWallet,
  FaMoneyBillWave,
  FaGem,
} from "react-icons/fa";

const steps = [
  {
    title: "Select Diamond Package",
    icon: FaShoppingCart,
    content: "Choose the diamond pack you want to purchase.",
  },
  {
    title: "Enter User ID & Zone ID",
    icon: FaIdCard,
    content: "Fill in your MLBB Player ID, Zone ID, and In-Game Name correctly.",
  },
  {
    title: "Choose Payment Method",
    icon: FaWallet,
    content: "Select UPI, Wallet, or other available options.",
  },
  {
    title: "Complete Payment",
    icon: FaMoneyBillWave,
    content: "Pay securely using the selected method.",
  },
  {
    title: "Receive Diamonds",
    icon: FaGem,
    content: "Diamonds will be credited instantly.",
  },
];

export default function MLBBPurchaseGuide() {
  const [active, setActive] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-base sm:text-lg font-semibold">
          How to Buy MLBB Diamonds
        </h3>
        <p className="text-xs text-[var(--muted)] mt-1 mb-5">
          Simple & secure step-by-step process
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === active;
          const isDone = index < active;

          return (
            <motion.div
              key={index}
              className="flex gap-3"
              variants={itemVariants}
            >
              {/* LEFT INDICATOR */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-xs font-bold
                    ${isDone
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-[var(--accent)] text-black"
                        : "bg-[var(--muted-bg)] text-[var(--muted)]"
                    }
                  `}
                  animate={isActive ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 1
                  }}
                >
                  {isDone ? "✓" : index + 1}
                </motion.div>

                {index !== steps.length - 1 && (
                  <div className="w-px flex-1 bg-[var(--border)] mt-2" />
                )}
              </div>

              {/* CONTENT */}
              <motion.button
                onClick={() => setActive(index)}
                className={`
                  flex-1 text-left rounded-xl
                  border px-4 py-3
                  transition-all duration-300
                  ${isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:bg-[var(--muted-bg)]/40"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-7 h-7 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center shrink-0"
                    animate={isActive ? {
                      rotate: [0, 5, -5, 0],
                    } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: isActive ? Infinity : 0,
                      repeatDelay: 2
                    }}
                  >
                    <Icon className="text-[var(--accent)] text-sm" />
                  </motion.div>

                  <p className="text-sm font-medium leading-tight">
                    {step.title}
                  </p>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      className="mt-2 text-xs text-[var(--muted)] leading-relaxed pl-10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.content}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
