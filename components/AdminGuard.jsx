"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.success && data.user.userType === "owner") {
                    setAuthorized(true);
                } else {
                    router.replace("/");
                }
            } catch (err) {
                console.error("Auth check failed", err);
                router.replace("/");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) return null;
    if (!authorized) return null;

    return children;
}
