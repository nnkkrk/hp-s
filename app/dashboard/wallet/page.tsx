"use client";

import { useState, useEffect } from "react";
import AuthGuard from "../../../components/AuthGuard";
import WalletTab from "../../../components/Dashboard/WalletTab";
import { FEATURE_FLAGS } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function WalletPage() {
    const [walletBalance, setWalletBalance] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (!FEATURE_FLAGS.ENABLE_WALLET) {
            router.push("/dashboard");
        }
    }, [router]);

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
            {!FEATURE_FLAGS.ENABLE_WALLET ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-2">Wallet is Disabled</h2>
                        <p className="text-[var(--muted)]">Redirecting you back...</p>
                    </div>
                </div>
            ) : (
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
            )}
        </AuthGuard>
    );
}
