"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { RiCloseFill, RiRobot2Fill } from "react-icons/ri";
import { FiSend, FiMessageSquare } from "react-icons/fi";

/* ═══════════════════════════════════════════════
   KNOWLEDGE BASE
═══════════════════════════════════════════════ */
const KB = [
    {
        keys: ["hi", "hello", "hey", "hii", "helo", "sup", "yo"],
        reply: "Hey there! 👋 Welcome to **Tronics Store**!\n\nI'm your 24/7 support bot. How can I help you today?",
        chips: ["How to top up?", "Payment methods", "Delivery time", "Refund policy"],
    },
    {
        keys: ["top up", "topup", "recharge", "buy diamond", "purchase", "how to order", "how to buy"],
        reply: "Topping up is super easy! 🎮\n\n1. Go to **Games** and pick your game\n2. Enter your **Player ID / Zone ID**\n3. Choose a diamond pack\n4. Pay securely\n5. Diamonds land in your account **instantly!**",
        chips: ["Payment methods", "Delivery time", "Find my ID"],
    },
    {
        keys: ["payment", "pay", "upi", "gpay", "phonepe", "paytm", "card", "net banking", "how to pay"],
        reply: "We accept all major payment methods 💳\n\n• **UPI** (GPay, PhonePe, Paytm)\n• **Debit / Credit Cards**\n• **Net Banking**\n• **Wallet Balance**\n\nAll payments are 100% secure & encrypted.",
        chips: ["How to top up?", "Delivery time", "Refund policy"],
    },
    {
        keys: ["delivery", "how long", "instant", "when", "receive", "fast"],
        reply: "⚡ Delivery is **instant** — usually within **5–30 seconds** after payment!\n\nIf you don't receive within 5 minutes, contact our support team.",
        chips: ["Contact support", "Refund policy", "Track order"],
    },
    {
        keys: ["refund", "money back", "cancel", "wrong", "mistake", "failed"],
        reply: "We have a clear refund policy 📋\n\n• **Failed orders** → refunded to wallet automatically\n• **Wrong ID** → contact us within 1 hour\n• **Duplicate orders** → fully refundable\n\nSee full policy at /refund-policy",
        chips: ["Contact support", "Track order"],
    },
    {
        keys: ["mlbb", "mobile legends", "ml", "bang bang", "diamonds"],
        reply: "We support **Mobile Legends: Bang Bang** top-ups! 🗡️\n\nAll diamond packs from **11 to 9999 diamonds** at the best prices. Enter your **Player ID + Zone ID** correctly!",
        chips: ["Find my ID", "How to top up?", "Payment methods"],
    },
    {
        keys: ["player id", "zone id", "uid", "find id", "my id", "game id", "user id"],
        reply: "Finding your MLBB Player ID 🔍\n\n1. Open Mobile Legends\n2. Tap your **profile picture** (top left)\n3. Your **ID** and **Zone ID** are shown below your name\n\nExample: **123456789 (1234)**",
        chips: ["How to top up?", "Contact support"],
    },
    {
        keys: ["wallet", "balance", "add money", "deposit", "credit"],
        reply: "Your **Wallet** stores balance for faster checkouts! 💰\n\nTo add money:\n1. Go to **Dashboard → Wallet**\n2. Choose amount\n3. Pay via UPI/Card\n\nWallet balance never expires!",
        chips: ["How to top up?", "Payment methods"],
    },
    {
        keys: ["discount", "offer", "promo", "coupon", "deal", "sale", "cheap", "price"],
        reply: "We always offer **competitive prices** 🏷️\n\nCheck our **Flash Sale** section on the home page for limited-time deals! We also have a **referral program** — invite friends and earn wallet credits.",
        chips: ["How to top up?", "Referral program"],
    },
    {
        keys: ["referral", "refer", "invite", "earn", "commission"],
        reply: "Our **Referral Program** rewards you for every friend you bring! 🎁\n\nShare your referral link from the Dashboard. When your friend makes their first purchase, you both get wallet credits!",
        chips: ["How to top up?", "Wallet balance"],
    },
    {
        keys: ["account", "login", "sign in", "register", "signup", "sign up", "forgot password", "password"],
        reply: "Account help 🔐\n\n• **Login** with Google or Email\n• **Forgot password?** Use the reset link on the login page\n• **New here?** Sign up takes 30 seconds!\n\nYour account stores order history, wallet & referrals.",
        chips: ["Wallet balance", "Track order", "Contact support"],
    },
    {
        keys: ["track", "order status", "order history", "my order", "check order"],
        reply: "Track your orders easily! 📦\n\nGo to **Dashboard → Orders** to see:\n• Order status (Pending / Completed / Failed)\n• Transaction ID\n• Delivery timestamp",
        chips: ["Refund policy", "Contact support"],
    },
    {
        keys: ["contact", "support", "help", "agent", "human", "talk", "whatsapp", "instagram"],
        reply: "Need to reach us? We're here 24/7! 📞\n\n• **WhatsApp:** +91 9366077306\n• **Instagram:** @meowjiofficial.mlbb\n• **Dashboard:** Submit a support query\n\nAverage response time: **< 5 minutes**",
        chips: ["How to top up?", "Refund policy"],
    },
    {
        keys: ["safe", "secure", "trust", "legit", "real", "scam", "fake"],
        reply: "100% Safe & Trusted! 🛡️\n\n• **SSL encrypted** payments\n• **10,000+** happy customers\n• **Instant delivery** — no waiting\n• Listed on **Trustpilot** with verified reviews",
        chips: ["Payment methods", "Refund policy"],
    },
    {
        keys: ["game", "games", "which game", "supported", "available"],
        reply: "We support multiple games! 🎮\n\n• **Mobile Legends: Bang Bang**\n• **Free Fire**\n• **PUBG Mobile**\n• **Genshin Impact**\n• **Valorant**\n• And many more!\n\nCheck the **Games** page for the full list.",
        chips: ["How to top up?", "Payment methods"],
    },
    {
        keys: ["thank", "thanks", "ty", "thx", "great", "awesome", "nice", "good", "perfect"],
        reply: "You're welcome! 😊 Happy gaming! 🎮\n\nIf you need anything else, I'm always here!",
        chips: ["Discount offers", "How to top up?"],
    },
    {
        keys: ["bye", "goodbye", "see you", "later", "cya"],
        reply: "Goodbye! 👋 Come back anytime. Happy gaming and may your rank always climb! 🏆",
        chips: [],
    },
];

const FALLBACK = {
    reply: "Hmm, I'm not sure about that 🤔\n\nLet me connect you with our support team!\n\n• **WhatsApp:** +91 9366077306\n• **Instagram:** @meowjiofficial.mlbb",
    chips: ["How to top up?", "Payment methods", "Contact support"],
};

const WELCOME = {
    role: "bot",
    text: "Hi! 👋 I'm **Tronics Bot**, your 24/7 support assistant!\n\nI can help with top-ups, payments, delivery, refunds, and more. What do you need?",
    chips: ["How to top up?", "Payment methods", "Delivery time", "Refund policy"],
    time: new Date(),
};

/* ── Markdown bold renderer ── */
function Md({ text }) {
    const lines = text.split("\n");
    return (
        <>
            {lines.map((line, li) => {
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                    <div key={li} style={{ minHeight: line === "" ? 6 : "auto" }}>
                        {parts.map((p, pi) =>
                            p.startsWith("**") && p.endsWith("**")
                                ? <strong key={pi} style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700 }}>{p.slice(2, -2)}</strong>
                                : <span key={pi}>{p}</span>
                        )}
                    </div>
                );
            })}
        </>
    );
}

/* ── Typing dots ── */
function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, var(--accent), #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "white",
            }}>
                <RiRobot2Fill />
            </div>
            <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "4px 16px 16px 16px",
                padding: "12px 16px",
                display: "flex", gap: 5, alignItems: "center",
            }}>
                {[0, 0.22, 0.44].map((d, i) => (
                    <motion.div key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── KB matcher ── */
function getResponse(input) {
    const q = input.toLowerCase().trim();
    for (const entry of KB) {
        if (entry.keys.some(k => q.includes(k))) {
            return { reply: entry.reply, chips: entry.chips || [] };
        }
    }
    return FALLBACK;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ⚠️  All hooks run unconditionally.
       Visibility gating is done via `hidden` flag
       in the return JSX — never an early return.
═══════════════════════════════════════════════ */
export default function ChatBot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [hasNew, setHasNew] = useState(true);
    const [visible, setVisible] = useState(true);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const lastScrollY = useRef(0);

    /* Scroll hide/show — always registered */
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            if (y > lastScrollY.current && y > 80) {
                setVisible(false);
                setIsOpen(false);
            } else {
                setVisible(true);
            }
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        const handleToggle = () => setIsOpen(v => !v);
        window.addEventListener('toggle-chatbot', handleToggle);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener('toggle-chatbot', handleToggle);
        };
    }, []);

    /* Auto-scroll messages */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    /* Broadcast state */
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('chatbot-state-change', { detail: { isOpen } }));
    }, [isOpen]);

    /* Focus input on open */
    useEffect(() => {
        if (isOpen) {
            setHasNew(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = useCallback((text) => {
        const trimmed = (text || input).trim();
        if (!trimmed) return;
        setMessages(prev => [...prev, { role: "user", text: trimmed, time: new Date() }]);
        setInput("");
        setTyping(true);
        const { reply, chips } = getResponse(trimmed);
        setTimeout(() => {
            setTyping(false);
            setMessages(prev => [...prev, { role: "bot", text: reply, chips, time: new Date() }]);
        }, 700 + Math.min(reply.length * 7, 1100));
    }, [input]);

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    /* ── Gate visibility — NO early return before hooks ── */
    const isGamesPage = pathname.startsWith("/games");

    /* ── FAB animation wrapper ── */
    const fabStyle = {
        position: "fixed", bottom: 92, left: 16, zIndex: 200,
        transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s",
        transform: visible ? "translateY(0)" : "translateY(110px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
    };

    const fabContainerClassName = "hidden lg:block";

    return (
        <div style={{ display: isGamesPage && !isOpen ? 'none' : 'block' }}>
            {/* ══ CHAT PANEL ══ */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.93 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        style={{
                            position: "fixed", bottom: 150, left: 16,
                            width: 280, height: 420, zIndex: 200,
                            borderRadius: 22, overflow: "hidden",
                            display: "flex", flexDirection: "column",
                            background: "#080812",
                            border: "1px solid rgba(255,255,255,0.09)",
                            boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)",
                        }}
                    >
                        {/* Gradient top stripe */}
                        <div style={{ height: 2, background: "linear-gradient(90deg, var(--accent), #a855f7, #ec4899)", flexShrink: 0 }} />

                        {/* Header */}
                        <div style={{
                            padding: "13px 14px", flexShrink: 0,
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.12))",
                            display: "flex", alignItems: "center", gap: 10,
                        }}>
                            <div style={{ position: "relative" }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--accent), #a855f7)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 17, color: "white",
                                    boxShadow: "0 0 14px rgba(168,85,247,0.4)",
                                }}>
                                    <RiRobot2Fill />
                                </div>
                                <div style={{
                                    position: "absolute", bottom: 1, right: 1,
                                    width: 9, height: 9, borderRadius: "50%",
                                    background: "#4ade80", border: "2px solid rgba(8,8,18,0.9)",
                                }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.92)", margin: 0 }}>Tronics Bot</p>
                                <p style={{ fontSize: 9, color: "#4ade80", margin: 0, fontWeight: 600, letterSpacing: "0.04em" }}>● Online · Replies instantly</p>
                            </div>
                            <motion.button
                                onClick={() => setIsOpen(false)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "rgba(255,255,255,0.6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", fontSize: 16,
                                }}
                            >
                                <RiCloseFill />
                            </motion.button>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1, overflowY: "auto", padding: "12px 12px 6px",
                            display: "flex", flexDirection: "column", gap: 12,
                            scrollbarWidth: "none",
                        }}>
                            {messages.map((msg, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22 }}
                                >
                                    {msg.role === "bot" ? (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5 }}>
                                            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                                <div style={{
                                                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                                                    background: "linear-gradient(135deg, var(--accent), #a855f7)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 12, color: "white",
                                                }}>
                                                    <RiRobot2Fill />
                                                </div>
                                                <div style={{
                                                    maxWidth: 215,
                                                    background: "rgba(255,255,255,0.07)",
                                                    border: "1px solid rgba(255,255,255,0.10)",
                                                    borderRadius: "4px 16px 16px 16px",
                                                    padding: "9px 12px",
                                                    fontSize: 12, lineHeight: 1.65,
                                                    color: "rgba(255,255,255,0.82)",
                                                }}>
                                                    <Md text={msg.text} />
                                                </div>
                                            </div>
                                            {msg.chips?.length > 0 && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingLeft: 34 }}>
                                                    {msg.chips.map(chip => (
                                                        <motion.button key={chip}
                                                            onClick={() => sendMessage(chip)}
                                                            whileHover={{ scale: 1.04 }}
                                                            whileTap={{ scale: 0.96 }}
                                                            style={{
                                                                fontSize: 9.5, fontWeight: 600,
                                                                padding: "3px 9px", borderRadius: 20,
                                                                background: "rgba(255,255,255,0.06)",
                                                                border: "1px solid rgba(255,255,255,0.13)",
                                                                color: "rgba(255,255,255,0.65)",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            {chip}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}
                                            <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", paddingLeft: 34 }}>
                                                {msg.time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                                            <div style={{
                                                maxWidth: 195,
                                                background: "linear-gradient(135deg, var(--accent), #a855f7)",
                                                borderRadius: "16px 4px 16px 16px",
                                                padding: "9px 12px",
                                                fontSize: 12, lineHeight: 1.55,
                                                color: "white", fontWeight: 500,
                                            }}>
                                                {msg.text}
                                            </div>
                                            <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)" }}>
                                                {msg.time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {typing && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                    <TypingDots />
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: "9px 11px 13px",
                            borderTop: "1px solid rgba(255,255,255,0.07)",
                            display: "flex", gap: 7, alignItems: "center",
                            flexShrink: 0,
                        }}>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Ask me anything..."
                                style={{
                                    flex: 1,
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    borderRadius: 13,
                                    padding: "8px 12px",
                                    fontSize: 12, color: "rgba(255,255,255,0.88)",
                                    outline: "none", fontFamily: "inherit",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                            />
                            <motion.button
                                onClick={() => sendMessage()}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                disabled={!input.trim()}
                                style={{
                                    width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                                    background: input.trim()
                                        ? "linear-gradient(135deg, var(--accent), #a855f7)"
                                        : "rgba(255,255,255,0.06)",
                                    border: "none",
                                    cursor: input.trim() ? "pointer" : "default",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: input.trim() ? "white" : "rgba(255,255,255,0.25)",
                                    fontSize: 14,
                                    transition: "all 0.2s",
                                    boxShadow: input.trim() ? "0 4px 14px rgba(168,85,247,0.35)" : "none",
                                }}
                            >
                                <FiSend />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ FAB ══ */}
            <div className={fabContainerClassName} style={fabStyle}>
                {/* Pulse rings when closed */}
                {!isOpen && (
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "var(--accent)", pointerEvents: "none", filter: "blur(8px)" }}
                    />
                )}

                {/* Spinning conic ring */}
                <motion.div
                    animate={{ rotate: isOpen ? 0 : 360 }}
                    transition={{ duration: 5, repeat: isOpen ? 0 : Infinity, ease: "linear" }}
                    style={{
                        position: "absolute", inset: -1.5, borderRadius: "50%",
                        background: "conic-gradient(from 0deg, var(--accent), #a855f7, #ec4899, var(--accent))",
                        opacity: 0.8, zIndex: 0,
                    }}
                />

                {/* Button */}
                <motion.button
                    onClick={() => setIsOpen(v => !v)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    style={{
                        position: "relative", zIndex: 1,
                        width: 40, height: 40, borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isOpen
                            ? "#0a0a14"
                            : "linear-gradient(135deg, var(--accent), #a855f7)",
                        color: "white", fontSize: 16,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
                    }}
                    aria-label="Open chat"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isOpen ? "close" : "chat"}
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            {isOpen ? <RiCloseFill /> : <FiMessageSquare />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                {/* Unread badge */}
                <AnimatePresence>
                    {hasNew && !isOpen && (
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            style={{
                                position: "absolute", top: -3, right: -3, zIndex: 2,
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#ef4444",
                                border: "2px solid rgba(8,8,18,0.9)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 9, fontWeight: 800, color: "white",
                            }}
                        >
                            1
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
