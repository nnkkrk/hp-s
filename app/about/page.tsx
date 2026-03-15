import Link from "next/link";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Meow Ji";

export const metadata = {
  title: `About | ${BRAND}`,
  description: `Learn more about ${BRAND} — a fast, secure, and affordable game top-up platform with instant delivery and 24×7 automated service.`,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      
      {/* 🌟 Hero Section */}
      <section className="relative text-center py-28 px-6 overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--card)] to-transparent">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-10 blur-[160px] animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">
           {BRAND}
        </h1>

        <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
          Your trusted destination for instant game top-ups, safe payments, and
          automated delivery — 24×7 ⚡
        </p>
      </section>

      {/* 📘 Our Story */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400">
          ⚡ Our Story
        </h2>

        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-3xl mx-auto mb-8">
          {BRAND} was built to make in-game purchases simple, fast, and reliable.
          We noticed players needed a platform that delivers game currency instantly,
          without complicated steps or unsafe third-party risks.
        </p>

        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-3xl mx-auto">
          🔹 Instant top-ups for popular games  
          🔹 Secure & verified payment methods  
          🔹 Automated delivery with real-time order updates  
          🔹 Transparent pricing with no hidden fees  
        </p>
      </section>

      {/* 💖 Values Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400">
          💙 Why Choose {BRAND}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Delivery",
              desc: "Orders are processed automatically and delivered instantly after payment confirmation.",
              icon: "⚡",
            },
            {
              title: "Safe & Secure",
              desc: "We use trusted payment gateways and verified APIs to ensure maximum security.",
              icon: "🔐",
            },
            {
              title: "Affordable Pricing",
              desc: "Competitive prices, regular offers, and no hidden charges — ever.",
              icon: "💰",
            },
          ].map((val, i) => (
            <div
              key={i}
              className="group relative p-8 border border-[var(--border)] rounded-2xl bg-[var(--card)] hover:shadow-[0_0_25px_var(--accent)] transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{val.icon}</span>
                <h3 className="text-xl font-semibold mb-3 text-[var(--accent)]">
                  {val.title}
                </h3>
                <p className="text-[var(--muted)] text-base">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📣 Follow / Trust Section */}
      <section className="relative py-24 text-center border-t border-[var(--border)] bg-[var(--background)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[var(--accent)] to-purple-700 opacity-10 blur-[180px] animate-pulse -translate-x-1/2 -translate-y-1/2" />
        </div>

        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400">
          Trusted by Gamers
        </h2>

        <p className="text-[var(--muted)] mb-8 max-w-2xl mx-auto text-lg">
          Thousands of successful top-ups delivered securely.
          Follow us for offers, updates, and new game launches.
        </p>

        <a
          href="https://instagram.com/mlbbtopup.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-110 hover:shadow-[0_0_20px_var(--accent)] transition-all duration-300"
        >
          <span>@mlbbtopup.in</span>
        </a>
      </section>
    </main>
  );
}
