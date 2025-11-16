"use client";
import useMap from "@/zustand/map";
import { Navigation } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
// 案内開始ボタンを押下時にapiを呼び出す
export default function StartNavigation() {
  const { positionToMap, setIsStartedNavigation, setIsModalOpen, setStartUserPosition } = useMap();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleNavigate = async () => {
    try {
      setIsSubmitting(true);
      // 案内開始地点の位置情報しゅとく
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setStartUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          toast.error("案内開始地点の取得に失敗しました。位置情報を許可してください。");
        }
      );

      // 目的地の譲歩王をそうしん
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
      setIsStartedNavigation(true);
      // 案内ボタンを押したらモーダル閉じる
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "案内に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <button
      className="flex items-center space-x-2 bg-[#fe0000] rounded-full px-4 py-2 text-white h-[31px]"
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
      <span>{isSubmitting ? "案内開始中..." : "開始"}</span>
    </button>
  );
}
