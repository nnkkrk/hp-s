// app/page.tsx
import HomeSection from "@/components/Home/Home";

export const metadata = {
  title: "Happy Store – MLBB Diamond Top Up | Instant & Secure",
  description:
    "Happy Store is a fast and secure Mobile Legends (MLBB) diamond top-up platform. Instant delivery, safe payments, and 24/7 automated service.",
  keywords: [
    "MLBB top up",
    "buy MLBB diamonds",
    "Mobile Legends recharge",
    "Happy Store top up",
  ],
};

export default function Page() {
  return (
    <main>
      <HomeSection />
    </main>
  );
}
