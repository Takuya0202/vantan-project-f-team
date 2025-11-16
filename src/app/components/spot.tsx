"use client";
import React, { useState, useEffect } from "react";

export interface SpotData {
  id: number;
  name: string;
  view: number;
}

export default function SpotRanking() {
  const [spots, setSpots] = useState<SpotData[]>([]);
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
    <div className="w-[339px] h-[590px] mx-auto bg-[#EDE3D2] p-6 rounded-lg flex flex-col -mt-20">
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
              <div className="flex-grow text-left text-gray-900 w-[100px] mr-7 overflow-x-auto [&::-webkit-scrollbar]:h-0">
                <span className="whitespace-nowrap">{spot.name}</span>
              </div>
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
