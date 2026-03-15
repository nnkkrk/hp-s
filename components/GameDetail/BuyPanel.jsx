"use client";

import Image from "next/image";
import logo from "@/public/logo.png";

export default function BuyPanel({
  activeItem,
  onBuy,
  redirecting,
  buyPanelRef,
}) {
  return (
    <div
      ref={buyPanelRef}
      className="max-w-6xl mx-auto bg-[var(--card)] border border-[var(--border)]
      rounded-xl p-4 flex flex-col gap-4"
    >
      <div className="flex gap-4 items-center">
        <div className="relative w-[110px] h-[110px] rounded-xl overflow-hidden">
          <Image
            src={activeItem.itemImageId?.image || logo}
            alt={activeItem.itemName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold">
            💎 {activeItem.itemName}
          </h2>

          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-2xl font-extrabold text-[var(--accent)]">
              ₹{activeItem.sellingPrice}
            </p>

            {activeItem.dummyPrice && (
              <p className="text-xs line-through text-[var(--muted)]">
                ₹{activeItem.dummyPrice}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onBuy(activeItem)}
        disabled={redirecting}
        className={`w-full py-3 rounded-xl font-bold text-base transition
          ${
            redirecting
              ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
              : "bg-[var(--accent)] text-black hover:opacity-90"
          }`}
      >
        {redirecting ? "Redirecting…" : "Buy Now →"}
      </button>
    </div>
  );
}
