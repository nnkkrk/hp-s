"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import ValidationStep from "./ValidationStep";
import ReviewAndPaymentStep from "./ReviewAndPaymentStep";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";

export default function BuyFlowPage() {
  const { slug, itemSlug } = useParams();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [playerId, setPlayerId] = useState(""); // BGMI Character ID
  const [reviewData, setReviewData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        setUserEmail(data.user.email);
        setUserPhone(data.user.phone);
        setWalletBalance(data.user.wallet || 0);
      });
  }, []);

  /* ================= ITEM DATA ================= */
  const itemName = params.get("name") || "";
  const price = Number(params.get("price") || 0);
  const discount = Number(params.get("discount") || 0);
  const totalPrice = price - discount;
  const itemImage = params.get("image") || "";

  /* ================= BGMI VALIDATION (ALWAYS PASS) ================= */
  const handleValidate = () => {
    if (!playerId) {
      alert("Please enter Character ID");
      return;
    }

    // ✅ Temporary BGMI bypass
    saveVerifiedPlayer({
      playerId,
      zoneId: "", // BGMI does not use zone
      username: "OTT",
      region: "INDIA",
      savedAt: Date.now(),
    });

    setReviewData({
      userName: "OTT",
      region: "INDIA",
      playerId,
      zoneId: "",
    });

    setStep(2);
  };

  /* ================= PAYMENT COMPLETE ================= */
  const handlePayment = async () => {
    setTimeout(() => setShowSuccess(true), 500);
  };

  return (
    <AuthGuard>
      <section className="px-6 py-8 max-w-3xl mx-auto">
        {/* ================= SELECTED ITEM ================= */}
        {itemName && (
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            {itemImage && (
              <img
                src={itemImage}
                alt={itemName}
                className="w-14 h-14 rounded-lg object-cover"
              />
            )}

            <div className="flex-1">
              <p className="text-sm text-[var(--muted)]">Selected Item</p>
              <h3 className="font-semibold text-base">{itemName}</h3>

              <div className="text-sm mt-1">
                <span className="text-[var(--accent)] font-medium">
                  ₹{totalPrice}
                </span>

                {discount > 0 && (
                  <span className="ml-2 line-through text-gray-500 text-xs">
                    ₹{price}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP INDICATOR ================= */}
        <div className="relative flex items-center justify-between mb-10">
          <div className="absolute top-[31%] left-[15%] w-[70%] h-[3px] bg-gray-700 -z-0 rounded-full">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-500 rounded-full"
              style={{
                width:
                  step === 1 ? "0%" :
                    step === 2 ? "50%" :
                      step === 3 ? "100%" : "0%",
              }}
            />
          </div>

          {[1, 2, 3].map((num) => (
            <div key={num} className="relative z-10 flex flex-col items-center w-1/3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold text-sm
                ${step >= num
                    ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                    : "border-gray-600 bg-[var(--card)] text-gray-400"}`}
              >
                {num}
              </div>

              <p className={`text-sm mt-2 ${step >= num ? "text-[var(--accent)]" : "text-gray-500"}`}>
                {num === 1 ? "Validate" : num === 2 ? "Review" : "Payment"}
              </p>
            </div>
          ))}
        </div>

        {/* ================= SUCCESS ================= */}
        {showSuccess && (
          <div className="bg-green-600/20 border border-green-600 text-green-500 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">Payment Successful ✔</h2>
            <p className="text-sm mt-2">Your BGMI order has been placed.</p>
          </div>
        )}

        {/* ================= STEPS ================= */}
        {!showSuccess && (
          <>
            {step === 1 && (
              <ValidationStep
                playerId={playerId}
                setPlayerId={setPlayerId}
                onValidate={handleValidate}
                label="Character ID"
                placeholder="Enter Character ID"
              />
            )}

            {(step === 2 || step === 3) && reviewData && (
              <ReviewAndPaymentStep
                step={step}
                setStep={setStep}
                itemName={itemName}
                itemImage={itemImage}
                price={price}
                discount={discount}
                totalPrice={totalPrice}
                userEmail={userEmail}
                userPhone={userPhone}
                reviewData={reviewData}
                walletBalance={walletBalance}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onPaymentComplete={handlePayment}
                slug={slug}
                itemSlug={itemSlug}
              />
            )}
          </>
        )}
      </section>
    </AuthGuard>
  );
}
