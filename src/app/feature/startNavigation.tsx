"use client";
import useMap from "@/zustand/map";
import { Navigation } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
// 案内開始ボタンを押下時にapiを呼び出す
export default function StartNavigation() {
  const { positionToMap } = useMap();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleNavigate = async () => {
    try {
      setIsSubmitting(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/place/store`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: positionToMap.name,
          latitude: positionToMap.lat,
          longitude: positionToMap.lng,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        toast.error("案内に失敗しました。");
        return;
      }
      toast.success("案内に成功しました。");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "案内に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <button
      className="flex items-center space-x-2 bg-[#fe0000] rounded-2xl px-4 py-2"
      disabled={isSubmitting}
      onClick={handleNavigate}
    >
      <Navigation
        sx={{
          color: "white",
          width: "24px",
          height: "24px",
        }}
      />
      <span>開始</span>
    </button>
  );
}
