"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import logo from "@/public/logo.png";
import { FiActivity, FiShield, FiZap, FiCreditCard } from "react-icons/fi";

export default function ReviewAndPaymentStep({
  step,
  setStep,
  itemName,
  itemImage,
  price,
  discount,
  totalPrice,
  userEmail,
  userPhone,
  reviewData,
  walletBalance,
  paymentMethod,
  setPaymentMethod,
  onPaymentComplete,
  slug,
  itemSlug,
}) {
  const [upiQR, setUpiQR] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Generate UPI QR
  const handleUPI = async () => {
    setPaymentMethod("upi");
    const upiId = "mewji@upi"; // Fallback or dynamic
    const upiString = `upi://pay?pa=${upiId}&pn=Tronics Store&am=${totalPrice}&cu=INR`;
    const qr = await QRCode.toDataURL(upiString);
    setUpiQR(qr);
  };

  // Handle proceed to payment
  const handleProceed = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsRedirecting(true);

    try {
      const storedPhone = userPhone || localStorage.getItem("phone");
      const token = localStorage.getItem("token");

      const orderPayload = {
        gameSlug: slug,
        itemSlug,
        itemName,
        playerId: reviewData.playerId,
        zoneId: reviewData.zoneId,
        paymentMethod,
        email: userEmail || null,
        phone: storedPhone,
        currency: "INR",
      };

      const res = await fetch("/api/order/create-gateway-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Order failed: " + data.message);
        setIsRedirecting(false);
        return;
      }

      if (data.paidViaWallet) {
        localStorage.setItem("pending_topup_order", data.orderId);
        window.location.href = "/payment/topup-complete";
        return;
      }

      localStorage.setItem("pending_topup_order", data.orderId);
      window.location.href = data.paymentUrl;
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {step === 2 && (
        <>
          {/* ITEM SUMMARY */}
          <div className="bg-gradient-to-br from-[var(--card)] to-black/40 p-5 rounded-2xl border border-[var(--border)] shadow-xl flex items-center gap-5">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <Image src={itemImage || logo} alt={itemName} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{itemName}</h3>
              <p className="text-sm text-[var(--muted)] flex items-center gap-1.5">
                <FiZap className="text-yellow-400" /> Instant Delivery Enabled
              </p>
            </div>
          </div>

          {/* PLAYER & CONTACT DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[var(--card)]/50 p-5 rounded-2xl border border-[var(--border)]">
              <h4 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiShield className="text-indigo-400" /> Account Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Username</span>
                  <span className="font-semibold">{reviewData.userName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">User ID</span>
                  <span className="font-semibold text-[var(--accent)]">{reviewData.playerId}</span>
                </div>
                {reviewData.zoneId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Zone ID</span>
                    <span className="font-semibold">{reviewData.zoneId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--card)]/50 p-5 rounded-2xl border border-[var(--border)]">
              <h4 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiZap className="text-emerald-400" /> Contact Info
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Email</span>
                  <span className="font-semibold truncate max-w-[120px]">{userEmail || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Phone</span>
                  <span className="font-semibold">{userPhone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-2xl mt-8">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              Select Payment Method
            </h3>

            <div className="space-y-4">
              {/* Wallet Button */}
              <button
                onClick={() => {
                  if (walletBalance < totalPrice) return;
                  setPaymentMethod("wallet");
                }}
                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all duration-300 ${paymentMethod === "wallet"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                  : "border-[var(--border)] bg-black/20 hover:border-[var(--accent)]/40 hover:bg-black/30"
                  } ${walletBalance < totalPrice ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'wallet' ? 'bg-[var(--accent)] text-black' : 'bg-gray-800 text-gray-400'
                    }`}>
                    <FiActivity size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Pay via Wallet</p>
                    <p className="text-[10px] text-[var(--muted)]">Balance: ₹{walletBalance.toFixed(2)}</p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <div className="h-5 w-5 rounded-full bg-[var(--accent)] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-black" /></div>}
              </button>

              {walletBalance < totalPrice && (
                <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1.5 px-2">
                  <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                  Insufficient balance. Top up your wallet to pay instantly.
                </p>
              )}

              {/* UPI Button */}
              <button
                onClick={handleUPI}
                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all duration-300 ${paymentMethod === "upi"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                  : "border-[var(--border)] bg-black/20 hover:border-[var(--accent)]/40 hover:bg-black/30"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-[var(--accent)] text-black' : 'bg-gray-800 text-gray-400'
                    }`}>
                    <FiCreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">UPI Gateway</p>
                    <p className="text-[10px] text-[var(--muted)]">GPay, PhonePe, Paytm & More</p>
                  </div>
                </div>
                {paymentMethod === 'upi' && <div className="h-5 w-5 rounded-full bg-[var(--accent)] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-black" /></div>}
              </button>
            </div>
          </div>

          {/* PRICE SUMMARY & ACTIONS */}
          <div className="bg-gradient-to-br from-[var(--card)] to-black/60 p-6 rounded-2xl border border-[var(--border)] shadow-2xl mt-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Price</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="text-2xl font-black text-[var(--accent)]">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={isRedirecting || !paymentMethod || (paymentMethod === "wallet" && walletBalance < totalPrice)}
              className="w-full py-4 rounded-xl bg-[var(--accent)] text-black font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isRedirecting ? (
                <>
                  <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Buy Now <FiZap /></>
              )}
            </button>
          </div>
        </>
      )}

      {step === 3 && paymentMethod === "upi" && (
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center animate-in zoom-in duration-300">
          <h3 className="text-xl font-bold mb-2">Scan & Pay</h3>
          <p className="text-sm text-[var(--muted)] mb-6">Scan the QR code with any UPI app to complete payment</p>

          <div className="relative w-56 h-56 mx-auto bg-white p-4 rounded-2xl shadow-2xl border-4 border-[var(--accent)]">
            {upiQR ? (
              <Image src={upiQR} alt="UPI QR" fill className="p-4" />
            ) : (
              <div className="h-full flex items-center justify-center animate-pulse text-gray-300 text-xs">Generating QR...</div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={onPaymentComplete}
              className="w-full py-4 rounded-xl bg-[var(--accent)] text-black font-bold shadow-lg"
            >
              I have completed payment
            </button>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] font-medium text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
