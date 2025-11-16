"use client";

import measureDistance from "@/hooks/measure";
import useMap from "@/zustand/map";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";

// ナビを修了するボタン
export default function EndNavigation() {
  const {
    startUserPosition,
    positionToMap,
    currentUserPosition,
    setIsStartedNavigation,
    setIsModalOpen,
  } = useMap();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEnd = async () => {
    setIsSubmitting(true);
    try {
      // 案内開始時の位置情報の検証
      if (!startUserPosition.latitude || !startUserPosition.longitude) {
        toast.error("案内開始地点の情報が取得できませんでした。");
        return;
      }

      // 現在地の検証
      if (!currentUserPosition.latitude || !currentUserPosition.longitude) {
        toast.error("現在地の情報が取得できませんでした。");
        return;
      }

      // 案内開始地点から現在地までの距離を計算
      const distance = measureDistance({
        lat1: startUserPosition.latitude,
        lng1: startUserPosition.longitude,
        lat2: currentUserPosition.latitude,
        lng2: currentUserPosition.longitude,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/place/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeName: positionToMap.name,
          distance: distance,
        }),
      });

      if (response.status === 401 || response.status === 200) {
        toast.success("案内を終了しました。");
      } else {
        toast.error("走行距離の記録に失敗しました。");
      }
    } catch {
      toast.error("案内終了処理に失敗しました。");
    } finally {
      setIsStartedNavigation(false);
      setIsModalOpen(true);
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
