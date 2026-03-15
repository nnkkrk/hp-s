// app/page.tsx
import HomeSection from "@/components/Home/Home";

export const metadata = {
  title: "Tronics Store – MLBB Diamond Top Up | Instant & Secure",
  description:
    "Tronics Store is a fast and secure Mobile Legends (MLBB) diamond top-up platform. Instant delivery, safe payments, and 24/7 automated service.",
  keywords: [
    "MLBB top up",
    "buy MLBB diamonds",
    "Mobile Legends recharge",
    "Tronics Store top up",
  ],
};

export default function Page() {
  return (
    <main>
      <HomeSection />
    </main>
  );
}
