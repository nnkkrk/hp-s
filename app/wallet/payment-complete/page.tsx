"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

export default function PaymentComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("Checking payment status...");

  useEffect(() => {
    const orderId = localStorage.getItem("pending_order");
    const userId = localStorage.getItem("userId");

    if (!orderId) {
      setStatus("failed");
      setMessage("Order not found");
      return;
    }

    async function checkPayment() {
      try {
        const res = await fetch("/api/wallet/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, userId }),
        });

        const data = await res.json();

        if (data?.success) {
          setStatus("success");
          setMessage("Payment Successful!");

          // Update wallet balance
          const oldBal = Number(localStorage.getItem("walletBalance") || "0");
          const newBal = oldBal + Number(data.amount || 0);
          localStorage.setItem("walletBalance", String(newBal));

          // Optional cleanup
          localStorage.removeItem("pending_order");
        } else {
          setStatus("failed");
          setMessage("Payment failed or still pending");
        }
      } catch (err) {
        console.error("Payment check error:", err);
        setStatus("failed");
        setMessage("Unable to verify payment");
      }
    }

    checkPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg p-8 text-center">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          {status === "checking" && (
            <FaSpinner className="text-4xl animate-spin text-[var(--accent)]" />
          )}
          {status === "success" && (
            <FaCheckCircle className="text-5xl text-green-500" />
          )}
          {status === "failed" && (
            <FaTimesCircle className="text-5xl text-red-500" />
          )}
        </div>

        {/* STATUS TEXT */}
        <h1 className="text-2xl font-bold mb-2">{message}</h1>

        <p className="text-sm text-[var(--muted)]">
          {status === "checking" &&
            "Please wait while we verify your payment."}
          {status === "success" &&
            "Your wallet has been updated successfully."}
          {status === "failed" &&
            "If money was deducted, it will be auto-refunded or credited shortly."}
        </p>

        {/* ACTION */}
        <button
          onClick={() => window.close()}
          className="mt-6 w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-black hover:opacity-90 transition"
        >
          Close Page
        </button>
      </div>
    </div>
  );
}
