import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BottomNav from "@/components/BottomNav/BottomNav";
import GlobalElements from "@/components/GlobalElements";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FEATURE_FLAGS } from "@/lib/config";


export const metadata: Metadata = {
  title: "Tronics Store – MLBB Diamond Top Up | Instant & Secure",
  description: "Tronics Store is a fast and secure Mobile Legends (MLBB) diamond top-up platform. Instant delivery, safe payments, and 24/7 automated service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

          <Header />
          <main className="pt-14 pb-24 lg:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <GlobalElements />
        </GoogleOAuthProvider>

      </body>
      <GoogleAnalytics gaId="G-7F4003P2EE" />
      {/* <script src="https://quge5.com/88/tag.min.js" data-zone="191906" async data-cfasync="false"></script> */}
    </html>
  );
}
