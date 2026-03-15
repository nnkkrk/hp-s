"use client";

import AuthGuard from "../../../components/AuthGuard";
import QueryTab from "../../../components/Dashboard/QueryTab";

export default function QueryPage() {
    return (
        <AuthGuard>
            <section className="min-h-screen relative px-4 sm:px-6 py-10 sm:py-16 bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative">
                    <QueryTab />
                </div>
            </section>
        </AuthGuard>
    );
}
