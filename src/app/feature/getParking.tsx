"use client";
import useMap from "@/zustand/map";
import React, { useState, useEffect } from "react";
import { PlaceResult, NearbySearchResponse } from "@/types/parking";
/**
 * 指定された緯度経度から半径1km以内の駐車場情報を取得
 */
export default function GetParking() {
  const { viewState, setIsParkingOpen } = useMap();
  const [parkingData, setParkingData] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    // 緯度経度が有効な値でなければ処理を中断
    if (!viewState.longitude || !viewState.latitude) {
      setLoading(false);
      setError("緯度または経度が無効です。");
      return;
    }

    const fetchParkingData = async () => {
      setLoading(true);
      setError(null);

      // ★ リクエスト先を内部APIに変更
      const url = `/api/parking?lat=${viewState.latitude}&lng=${viewState.longitude}`;

      try {
        // 内部APIにリクエスト
        const response = await fetch(url);

        const data: NearbySearchResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `APIリクエスト失敗: ${response.status}`);
        }
        if (data.status === "OK") {
          const results = data.results.slice(0, limit);
          setParkingData(results);
        } else if (data.status === "ZERO_RESULTS") {
          setParkingData([]);
        } else {
          throw new Error(data.error_message || `APIエラー: ${data.status}`);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("エラーです。");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [viewState.latitude, viewState.longitude]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsParkingOpen(false)}
        className="absolute top-[-30px] w-[100px] left-1/2 -translate-x-1/2 rounded-2xl"
      >
        <p className="mb-[30px] text-center bg-white rounded-full">案内へ戻る</p>
      </div>
      <div className="h-[360px] overflow-scroll">
        {loading ? (
          <p className="text-center">検索中...</p>
        ) : error ? (
          <p style={{ color: "red" }}>エラーが発生しました: {error}</p>
        ) : parkingData.length === 0 ? (
          <p>駐車場は見つかりませんでした。</p>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {parkingData.map((place, index) => (
              <li key={index} className="m-[5px] border-b">
                <div className="flex">
                  <div className="items-center">
                    <p className="text-[50px] mr-3 mx-2 font-bold">P</p>
                  </div>
                  <div className="flex w-[220px] h-[100px] overflow-scroll items-center">
                    <div>
                      <strong>{place.name}</strong>
                      <p className="mt-[5px] text-[10px]">{place.vicinity}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="absolute top-1/2 -translate-y-1/2 text-[13px] text-center w-[90px] text-white">
                      <span
                        className={`
                        rounded-2xl px-[5px] py-px
                        ${
                          place.opening_hours
                            ? place.opening_hours.open_now
                              ? "bg-yellow-600" // 営業中
                              : "bg-red-700" // 営業終了
                            : "bg-blue-500" // 不明
                        }
                      `}
                      >
                        {place.opening_hours
                          ? place.opening_hours.open_now
                            ? "営業中"
                            : "営業終了"
                          : "営業時間不明"}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
