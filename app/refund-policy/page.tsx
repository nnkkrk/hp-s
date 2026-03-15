"use client";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Meow Ji";

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[var(--accent)] mb-6">
                    Refund Policy
                </h1>

                <p className="text-[var(--muted)] mb-10">
                    Last updated: February 2026
                </p>

                <p className="mb-6 leading-relaxed">
                    At <strong>{BRAND}</strong>, we strive to provide a seamless and reliable top-up experience.
                    Please read this policy carefully before making any purchase, as it outlines the conditions under which
                    refunds may be issued.
                </p>

                {/* 1 */}
                <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    1. Digital Nature of Service
                </h2>
                <p className="mb-6 leading-relaxed">
                    Due to the digital nature of game top-ups and virtual currencies, all sales are generally
                    final. Once a top-up has been successfully delivered to the provided Game ID, the transaction
                    cannot be reversed, and no refunds will be issued.
                </p>

                {/* 2 */}
                <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    2. Non-Refundable Scenarios
                </h2>
                <p className="mb-6 leading-relaxed">
                    Refunds will <strong>not</strong> be provided in the following circumstances:
                    <br /><br />
                    • <strong>Incorrect Information:</strong> If you provide an incorrect Game ID, Server, or Zone ID, and the top-up is processed based on that information.
                    <br />
                    • <strong>Change of Mind:</strong> If you decide you no longer want the virtual currency after the order has been initiated.
                    <br />
                    • <strong>Account Issues:</strong> If your game account is banned, restricted, or suspended for reasons unrelated to our service.
                    <br />
                    • <strong>Used Services:</strong> If the virtual currency has already been added to and used within your game account.
                </p>

                {/* 3 */}
                <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    3. Eligible Refund Scenarios
                </h2>
                <p className="mb-6 leading-relaxed">
                    You may be eligible for a refund or credit under the following conditions:
                    <br /><br />
                    • <strong>Failed Delivery:</strong> If the payment was successful but the top-up was not delivered to any account due to a technical failure on our end.
                    <br />
                    • <strong>Duplicate Charges:</strong> If you were accidentally charged twice for the same single order.
                    <br />
                    • <strong>Service Unavailability:</strong> If the specific service you purchased becomes unavailable after payment and before delivery.
                </p>

                {/* 4 */}
                <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    4. Refund Process
                </h2>
                <p className="mb-6 leading-relaxed">
                    To request a refund, please follow these steps:
                    <br /><br />
                    1. Contact our support team via the <a href="/contact" className="text-[var(--accent)] hover:underline">Contact Page</a> within 24 hours of the transaction.
                    2. Provide your Order ID, Transaction ID, and a clear explanation of why you are requesting a refund.
                    3. Attach any relevant screenshots or proof of payment.
                    <br /><br />
                    Refund requests are reviewed by our team manually. If approved, the refund will be processed to your original payment method or as {BRAND} wallet credit within 5-7 business days.
                </p>

                {/* 5 */}
                <h2 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                    5. Chargebacks
                </h2>
                <p className="mb-6 leading-relaxed">
                    Initiating a chargeback or payment dispute without contacting our support team first may result
                    in the permanent suspension of your {BRAND} account and the reporting of your Game ID to the
                    respective game developers.
                </p>

                <p className="leading-relaxed mt-10">
                    If you have any questions or need assistance with an order, please contact{" "}
                    <a href="/contact" className="text-[var(--accent)] hover:underline">
                        {BRAND} Support
                    </a>.
                </p>
            </div>
        </main>
    );
}
