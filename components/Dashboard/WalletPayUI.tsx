"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import QRCode from "qrcode";

interface WalletPayUIProps {
  title: string;
  qrText: string;             // dynamic QR data (UPI / USDT address)
  onConfirm: () => void;
}

export default function WalletPayUI({ title, qrText, onConfirm }: WalletPayUIProps) {
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    if (!qrText) return;

    // Generate QR Code
    QRCode.toDataURL(qrText, { width: 250, margin: 2 })
      .then((url) => setQrImage(url))
      .catch((err) => console.error("QR error:", err));
  }, [qrText]);

  return (
    <div className="text-center">

      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {/* QR Box */}
      <div className="bg-white w-50 h-60 mx-auto p-4 rounded-xl shadow flex items-center justify-center">

        {qrImage ? (
          <Image
            src={qrImage}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-lg"
          />
        ) : (
          <p className="text-sm text-gray-500">Generating QR...</p>
        )}

      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="mt-5 w-full p-3 bg-[var(--accent)] text-black font-semibold rounded-xl"
      >
        I Have Paid
      </button>
    </div>
  );
}
