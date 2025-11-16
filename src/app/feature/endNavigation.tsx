"use client";

import useMap from "@/zustand/map";
import { Close } from "@mui/icons-material";
import { useState } from "react";

// ナビを修了するボタン
export default function EndNavigation() {
  const { setIsStartedNavigation } = useMap();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleEnd = async () => {
    // 記録を保存するapi書く
    try {
      setIsStartedNavigation(false);
      setIsSubmitting(true);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <button
      onClick={handleEnd}
      className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md"
      disabled={isSubmitting}
    >
      <span className="text-black text-lg font-semibold">案内終了</span>
      <Close sx={{ width: 24, height: 24, color: "black" }} />
    </button>
  );
}
