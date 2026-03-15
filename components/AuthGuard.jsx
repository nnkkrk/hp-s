"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");

    // If neither email nor phone exist → redirect
    if (!email && !phone) {
      router.replace("/login");
    } else {
      setAllowed(true);
    }
  }, []);

  // Avoid flicker while checking
  if (!allowed) return null;

  return children;
}
