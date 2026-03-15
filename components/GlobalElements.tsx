"use client";

import dynamic from "next/dynamic";

const SocialFloat = dynamic(() => import("@/components/SocialFloat/SocialFloat"), { ssr: false });
const ChatBot = dynamic(() => import("@/components/ChatBot/ChatBot"), { ssr: false });
const Maintenance = dynamic(() => import("@/components/Maintenance/Maintenance"), { ssr: false });

export default function GlobalElements() {
    return (
        <>
            <SocialFloat />
            <ChatBot />
            <Maintenance />
        </>
    );
}
