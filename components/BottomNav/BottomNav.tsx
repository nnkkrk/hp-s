"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiGrid,
    FiGlobe,
    FiShoppingBag,
    FiLifeBuoy,
    FiMessageSquare,
    FiAward
} from "react-icons/fi";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Region", href: "/region", icon: FiGlobe },
    { name: "Games", href: "/games", icon: FiGrid },
    { name: "Rank", href: "/leaderboard", icon: FiAward },
    { name: "Home", href: "/", icon: FiHome, isCenter: true },
    { name: "Orders", href: "/dashboard/order", icon: FiShoppingBag },
    { name: "Support", href: "/dashboard/query", icon: FiLifeBuoy },
    { name: "Chat", href: "#chat", icon: FiMessageSquare, isAction: true },
];

export default function BottomNav() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const handleStateChange = (e: any) => {
            setIsChatOpen(e.detail.isOpen);
        };
        window.addEventListener('chatbot-state-change', handleStateChange);
        return () => window.removeEventListener('chatbot-state-change', handleStateChange);
    }, []);

    const handleAction = (e: React.MouseEvent, item: any) => {
        if (item.isAction && item.href === "#chat") {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('toggle-chatbot'));
        }
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden"
        >
            {/* Slim Profile Glass Bar */}
            <div className="relative w-full bg-[var(--card)]/90 backdrop-blur-3xl border-t border-[var(--border)] pb-safe-offset-1 shadow-[0_-10px_35px_rgba(0,0,0,0.1)]">
                <nav className="flex items-center justify-between px-1 h-11 relative">
                    {navItems.map((item) => {
                        const isChat = item.isAction && item.href === "#chat";
                        const isActive = isChat ? isChatOpen : (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
                        const Icon = item.icon;

                        if (item.isCenter) {
                            return (
                                <div key={item.name} className="relative flex-1 flex justify-center -translate-y-4">
                                    <Link href={item.href} className="group outline-none">
                                        <div className="relative">
                                            {/* Pulse effect for center button */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="center-active-glow"
                                                    className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl opacity-30 scale-150"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.3 }}
                                                />
                                            )}

                                            <div className={`
                                                w-11 h-11 rounded-full flex items-center justify-center relative z-10 transition-all duration-500
                                                ${isActive
                                                    ? "bg-[var(--accent)] shadow-[0_5px_15px_rgba(var(--accent),0.5)] scale-110"
                                                    : "bg-[var(--background)] border border-[var(--border)] shadow-md group-hover:bg-[var(--card)]"
                                                }
                                            `}>
                                                <Icon className={`text-lg transition-all duration-300 ${isActive ? "text-white" : "text-[var(--foreground)]/40 group-hover:text-[var(--accent)]"}`} />
                                            </div>

                                            {/* Minimal Active Bar below center */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dot-center"
                                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <div key={item.name} className="flex-1 flex flex-col items-center justify-center min-w-0">
                                {item.isAction ? (
                                    <button
                                        onClick={(e) => handleAction(e, item)}
                                        className="flex flex-col items-center group outline-none w-full"
                                    >
                                        <NavItemContent isActive={isActive} Icon={Icon} name={item.name} />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex flex-col items-center group outline-none w-full"
                                    >
                                        <NavItemContent isActive={isActive} Icon={Icon} name={item.name} />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </motion.div>
    );
}

function NavItemContent({ isActive, Icon, name }: { isActive: boolean; Icon: any; name: string }) {
    return (
        <div className="flex flex-col items-center relative py-0.5">
            <div className="relative flex items-center justify-center h-5">
                <Icon
                    className={`text-lg transition-all duration-300 ${isActive
                        ? "text-[var(--accent)] scale-105 drop-shadow-[0_0_6px_var(--accent)]"
                        : "text-[var(--foreground)]/25 group-hover:text-[var(--foreground)]/50"
                        }`}
                />
            </div>

            <span
                className={`text-[6.5px] font-black uppercase tracking-tighter transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis px-0.5 ${isActive
                    ? "text-[var(--accent)] opacity-100"
                    : "text-[var(--foreground)]/25 group-hover:text-[var(--foreground)]/40"
                    }`}
            >
                {name}
            </span>

            {/* Minimal line indicator for side items */}
            {isActive && (
                <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1 w-2.5 h-0.5 bg-[var(--accent)] rounded-full shadow-[0_0_5px_var(--accent)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                />
            )}
        </div>
    );
}
