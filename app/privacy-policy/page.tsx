"use client";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Meow Ji";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--accent)] mb-6">
          Privacy Policy
        </h1>

        <p className="text-[var(--muted)] mb-10">
          Last updated: December 2025
        </p>

        <p className="mb-6 leading-relaxed">
          At <strong>{BRAND}</strong>, we respect your privacy and are committed to
          protecting your personal information. This Privacy Policy explains how
          we collect, use, and safeguard your data when you use our website to
          purchase game top-ups, browse services, or interact with our platform.
        </p>

        {/* 1 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          1. Information We Collect
        </h2>
        <p className="mb-6 leading-relaxed">
          We may collect the following types of information:
          <br /><br />
          <strong>• Account & Order Information</strong> — such as email address,
          phone number, game ID, server/zone details, and order history required
          to process top-ups.
          <br /><br />
          <strong>• Payment Information</strong> — payments are handled securely
          through third-party payment gateways. We do not store sensitive payment
          details such as card numbers or UPI credentials.
          <br /><br />
          <strong>• Technical & Usage Data</strong> — including IP address,
          browser type, device information, pages visited, and timestamps for
          security, analytics, and fraud prevention.
        </p>

        {/* 2 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          2. How We Use Your Information
        </h2>
        <p className="mb-6 leading-relaxed">
          Your data is used to:
          <br /><br />
          • Process and deliver game top-ups accurately  
          <br />
          • Verify transactions and prevent fraud or misuse  
          <br />
          • Provide customer support and order assistance  
          <br />
          • Improve platform performance, reliability, and user experience  
          <br /><br />
          We do <strong>not</strong> sell, rent, or trade your personal information
          to third parties for marketing purposes.
        </p>

        {/* 3 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          3. Cookies & Tracking
        </h2>
        <p className="mb-6 leading-relaxed">
          {BRAND} uses cookies and similar technologies to:
          <br /><br />
          • Remember user preferences  
          <br />
          • Maintain login sessions  
          <br />
          • Analyze traffic and platform usage  
          <br /><br />
          You may disable cookies via your browser settings, but certain features
          of the website may not function properly.
        </p>

        {/* 4 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          4. Third-Party Services
        </h2>
        <p className="mb-6 leading-relaxed">
          We may use trusted third-party services for:
          <br /><br />
          • Payment processing  
          <br />
          • Analytics and performance monitoring  
          <br />
          • Hosting and content delivery  
          <br /><br />
          These providers operate under their own privacy policies. We recommend
          reviewing them for additional information on how your data is handled.
        </p>

        {/* 5 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          5. Data Security
        </h2>
        <p className="mb-6 leading-relaxed">
          We implement appropriate technical and organizational measures to
          protect your data against unauthorized access, alteration, or loss.
          However, no online platform can guarantee 100% security.
        </p>

        {/* 6 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          6. Your Rights
        </h2>
        <p className="mb-6 leading-relaxed">
          You have the right to:
          <br /><br />
          • Request access to your personal data  
          <br />
          • Request correction of inaccurate information  
          <br />
          • Request deletion of your data (subject to legal and transactional requirements)  
          <br /><br />
          To exercise these rights, please contact us via our{" "}
          <a href="/contact" className="text-[var(--accent)] hover:underline">
            Contact Page
          </a>.
        </p>

        {/* 7 */}
        <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
          7. Policy Updates
        </h2>
        <p className="mb-6 leading-relaxed">
          We may update this Privacy Policy periodically to reflect changes in
          our services, technology, or legal requirements. Any updates will be
          posted on this page with a revised “Last updated” date.
        </p>

        <p className="leading-relaxed">
          If you have any questions or concerns regarding this Privacy Policy,
          please contact{" "}
          <a href="/contact" className="text-[var(--accent)] hover:underline">
            {BRAND} Support
          </a>.
        </p>
      </div>
    </main>
  );
}
