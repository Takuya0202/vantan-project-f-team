"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function GuestLoginButton() {
    const router = useRouter();

    const handleGuestLogin = () => {
        // 仮処理：あとでゲストログイン処理を入れる
        console.log("ゲストログイン（仮）");
        router.push("/top");
    };

    return (
        <button onClick={handleGuestLogin} className="px-14 py-2 bg-green-800 text-white rounded-sm shadow-md hover:bg-green-900 active:scale-95 transition-transform duration-150">
            ゲストとしてログイン
        </button>
    );
}
