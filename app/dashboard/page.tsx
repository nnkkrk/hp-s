"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";

export default function Dashboard() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setUserDetails({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });

        setWalletBalance(data.user.wallet || 0);
      });
  }, [token]);

  const dashboardCards = [
    {
      key: "orders",
      label: "Orders",
      value: "View",
      icon: "📦",
      route: "/dashboard/order",
      description: "Track your orders"
    },
    {
      key: "wallet",
      label: "Wallet",
      value: `₹${walletBalance}`,
      icon: "💳",
      route: "/dashboard/wallet",
      description: "Manage your wallet"
    },
    {
      key: "account",
      label: "Account",
      value: "Manage",
      icon: "⚙️",
      route: "/dashboard/account",
      description: "Account settings"
    },
    {
      key: "query",
      label: "Support",
      value: "Help",
      icon: "💬",
      route: "/dashboard/query",
      description: "Get help & support"
    },
  ];

  return (
    <AuthGuard>
      <section className="min-h-screen px-5 py-7 bg-[var(--background)] text-[var(--foreground)]">

        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {userDetails.name || "Player"} 👋
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Track orders, manage wallet & account
            </p>
          </div>

          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-4 rounded-2xl flex items-center gap-4 shadow-sm backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-black shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">Wallet Balance</p>
              <p className="text-xl font-black text-[var(--accent)]">₹{walletBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-1 max-w-5xl mx-auto">
          {dashboardCards.map((card) => (
            <div
              key={card.key}
              onClick={() => router.push(card.route)}
              className="group relative bg-[var(--card)] border border-[var(--border)] 
                         rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300
                         hover:border-[var(--accent)]/50 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.15)]
                         hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/0 to-[var(--accent)]/0 
                              group-hover:from-[var(--accent)]/5 group-hover:to-transparent transition-all duration-300" />

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-0.5 group-hover:text-[var(--accent)] transition-colors">
                    {card.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-1 group-hover:line-clamp-none transition-all">
                    {card.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-[var(--muted)] group-hover:text-[var(--accent)] 
                                group-hover:translate-x-1 transition-all duration-300 shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AuthGuard>
  );
}
