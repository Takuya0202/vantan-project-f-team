"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function GuestLoginButton() {
  const router = useRouter();

  const handleGuestLogin = () => {
    router.push("/top");
  };

  return (
    <button
      onClick={handleGuestLogin}
      className="px-10 py-2 bg-green-800 text-white rounded-sm shadow-md 
        hover:bg-green-900 active:scale-95 transition-transform duration-150 w-[260px]"
    >
      ゲストとしてログイン
    </button>
  );
}
