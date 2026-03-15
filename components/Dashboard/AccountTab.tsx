"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheckCircle, FiAlertCircle, FiSettings } from "react-icons/fi";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

interface AccountTabProps {
  userDetails: UserDetails;
}

export default function AccountTab({ userDetails }: AccountTabProps) {
  const [newPass, setNewPass] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPass.length < 6) {
      setPassError("Minimum 6 characters required");
      return;
    }

    setLoadingPass(true);
    setPassError("");
    setPassSuccess("");

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: userDetails.email || userDetails.phone,
          newPassword: newPass,
        }),
      });

      const data = await res.json();
      setLoadingPass(false);

      if (!data.success) {
        setPassError(data.message || "Failed to update password.");
        return;
      }

      setNewPass("");
      setPassSuccess("Identity secure. Password updated!");
      setTimeout(() => setPassSuccess(""), 3000);
    } catch (error) {
      setLoadingPass(false);
      setPassError("System error. Please try again later.");
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          My <span className="text-[var(--accent)]">Profile</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
          Manage your account information and security settings.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= USER INFO ================= */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 px-2">
            <div className="h-9 w-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <FiUser className="text-lg" />
            </div>
            <h3 className="text-lg font-bold">Personal Info</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <InfoCard icon={FiUser} label="Name" value={userDetails.name} delay={0.1} />
            <InfoCard icon={FiMail} label="Email" value={userDetails.email} delay={0.2} />
            <InfoCard icon={FiPhone} label="Phone" value={userDetails.phone} delay={0.3} />
          </div>
        </motion.div>

        {/* ================= PASSWORD SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 px-2">
            <div className="h-9 w-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <FiLock className="text-lg" />
            </div>
            <h3 className="text-lg font-bold">Security</h3>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-lg relative overflow-hidden group">

            <AnimatePresence mode="wait">
              {passSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2"
                >
                  <FiCheckCircle className="text-lg shrink-0" />
                  <p className="text-xs font-bold">{passSuccess}</p>
                </motion.div>
              )}
              {passError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2"
                >
                  <FiAlertCircle className="text-lg shrink-0" />
                  <p className="text-xs font-bold">{passError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] ml-1">New Password</label>
                <div className="relative group/input">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPass}
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setPassError("");
                    }}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] 
                               focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <button
                disabled={loadingPass || !newPass}
                onClick={handlePasswordUpdate}
                className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold uppercase tracking-wider text-xs
                           flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/20
                           hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 
                           disabled:cursor-not-allowed"
              >
                {loadingPass ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <FiShield size={14} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[var(--muted)] font-medium leading-relaxed uppercase tracking-tighter italic">
                Authorized identity update only. <br /> Encrypted transmission active.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4"
      >
        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xl">
          <FiShield />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold mb-0.5">Secure Account</h4>
          <p className="text-[10px] text-[var(--muted)] font-medium leading-relaxed">
            Your account is protected by encrypted protocols and secure login sessions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, delay }: { icon: any; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 
                 hover:bg-[var(--card)] hover:border-[var(--accent)]/30 transition-all 
                 flex items-center gap-4 shadow-sm"
    >
      <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-xl transition-all duration-300">
        <Icon />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[var(--foreground)] truncate font-mono">
          {value || "Not Set"}
        </p>
      </div>
    </motion.div>
  );
}
