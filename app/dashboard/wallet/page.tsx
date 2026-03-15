"use client";

import { useState, useEffect } from "react";
import AuthGuard from "../../../components/AuthGuard";
import WalletTab from "../../../components/Dashboard/WalletTab";

export default function WalletPage() {
    const [walletBalance, setWalletBalance] = useState(0);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    useEffect(() => {
        if (!token) return;

        fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) return;
                setWalletBalance(data.user.wallet || 0);
            });
    }, [token]);

    return (
        <AuthGuard>
            <section className="min-h-screen relative px-4 sm:px-6 py-10 sm:py-16 bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative">
                    <WalletTab
                        walletBalance={walletBalance}
                        setWalletBalance={setWalletBalance}
                    />
                </div>
            </section>
        </AuthGuard>
    );
}
