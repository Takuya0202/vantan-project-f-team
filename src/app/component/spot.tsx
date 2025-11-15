"use client";
import React, { useState } from "react";

export interface SpotData {
  id: number;
  name: string;
  views: number;
}

const demoSpots: SpotData[] = [
  { id: 101, name: "伏見稲荷大社", views: 5021 },
  { id: 102, name: "上野動物園", views: 4890 },
  { id: 103, name: "東京ビッグサイト", views: 4500 },
  { id: 104, name: "富士山", views: 4123 },
  { id: 105, name: "白金青い池", views: 3987 },
  { id: 106, name: "大阪城公園", views: 3500 },
  { id: 107, name: "平等院鳳凰堂", views: 3110 },
  { id: 108, name: "清水寺", views: 2988 },
  { id: 109, name: "国営ひたち海浜公園", views: 2500 },
  { id: 110, name: "鳥取砂丘", views: 2100 },
];

export default function SpotRanking() {
  const [spots] = useState<SpotData[]>(demoSpots);

  return (
    <div className="w-[339px] h-[590px] mx-auto bg-[#EDE3D2] p-6 rounded-lg shadow-md flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 text-center">人気スポットランキング</h1>
      <div className="flex-grow overflow-y-auto">
        {spots.length > 0 ? (
          spots.map((spot, index) => (
            <div
              className="flex justify-between items-center py-3 border-b border-white"
              key={spot.id}
            >
              <span className="w-20 font-bold text-gray-800">{index + 1}位</span>
              <span className="flex-grow text-left text-gray-900">{spot.name}</span>
              <span className="text-base text-gray-700">{spot.views}visit</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">表示できるスポットがありません。</p>
        )}
      </div>
    </div>
  );
}
