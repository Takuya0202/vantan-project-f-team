"use client";
import React, { useState, useEffect } from "react";

export interface SpotData {
  id: number;
  name: string;
  view: number;
}
//一応デモ残してる
const demoSpots: SpotData[] = [
  { id: 101, name: "伏見稲荷大社", view: 5021 },
  { id: 102, name: "上野動物園", view: 4890 },
  { id: 103, name: "東京ビッグサイト", view: 4500 },
  { id: 104, name: "富士山", view: 4123 },
  { id: 105, name: "白金青い池", view: 3987 },
  { id: 106, name: "大阪城公園", view: 3500 },
  { id: 107, name: "平等院鳳凰堂", view: 3110 },
  { id: 108, name: "清水寺", view: 2988 },
  { id: 109, name: "国営ひたち海浜公園", view: 2500 },
  { id: 110, name: "鳥取砂丘", view: 2100 },
];

export default function SpotRanking() {
  const [spots, setSpots] = useState<SpotData[]>([]); //デモを表示させたかったら(demoSpots)
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  //デモ表示時useEffectコメントアウト
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch("/api/place/favorite");
        if (!response.ok) {
          throw new Error("データ取得に失敗しました。");
        }
        const data: SpotData[] = await response.json();
        setSpots(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="w-[339px] h-[590px] mx-auto bg-[#EDE3D2] p-6 rounded-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 text-center">人気スポットランキング</h1>
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">読み込み中...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : spots.length > 0 ? (
          spots.map((spot, index) => (
            <div
              className="flex justify-between items-center py-3 border-b border-white"
              key={spot.id}
            >
              <span className="w-13 font-bold text-gray-800">{index + 1}位</span>
              <span className="flex-grow text-left text-gray-900">{spot.name}</span>
              <span className="text-base text-gray-700">{spot.view} visit</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">表示できるスポットがありません。</p>
        )}
      </div>
    </div>
  );
}
