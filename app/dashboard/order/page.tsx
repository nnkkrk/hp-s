"use client";

import AuthGuard from "../../../components/AuthGuard";
import OrdersTab from "../../../components/Dashboard/OrdersTab";

export default function OrdersPage() {
    return (
        <AuthGuard>
            <section className="min-h-screen relative px-4 sm:px-6 py-10 sm:py-16 bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-full max-w-4xl h-96 bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative">
                    <OrdersTab />
                </div>
            </section>
        </AuthGuard>
    );
}
