"use client";
import React, { useState, useEffect } from "react";
import { PlaceResult, NearbySearchResponse, GetParkingProps } from "@/types/parking";
/**
 * 指定された緯度経度から半径1km以内の駐車場情報を取得
 */
export default function GetParking({ lat, lng, limit }: GetParkingProps) {
  const [parkingData, setParkingData] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 緯度経度が有効な値でなければ処理を中断
    if (!lat || !lng) {
      setLoading(false);
      setError("緯度または経度が無効です。");
      return;
    }

    const fetchParkingData = async () => {
      setLoading(true);
      setError(null);

      // ★ リクエスト先を内部APIに変更
      const url = `/api/parking?lat=${lat}&lng=${lng}`;

      try {
        // 内部APIにリクエスト
        const response = await fetch(url);

        const data: NearbySearchResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `APIリクエスト失敗: ${response.status}`);
        }
        if (data.status === "OK") {
          const results = limit ? data.results.slice(0, limit) : data.results;
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
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [lat, lng, limit]);

  return (
    <div>
      <h3>検索結果 (周辺1kmの駐車場)</h3>
      {loading ? (
        <p>検索中...</p>
      ) : error ? (
        <p style={{ color: "red" }}>エラーが発生しました: {error}</p>
      ) : parkingData.length === 0 ? (
        <p>駐車場は見つかりませんでした。</p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {parkingData.map((place, index) => (
            <li
              key={index}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              <strong>{place.name}</strong>
              <p style={{ margin: "5px 0 0 0" }}>{place.vicinity}</p>
              <p style={{ margin: "5px 0 0 0" }}>
                {place.opening_hours
                  ? place.opening_hours.open_now
                    ? "現在 営業中"
                    : "現在 営業時間外"
                  : "営業時間 不明"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
