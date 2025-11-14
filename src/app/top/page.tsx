"use client";
import { useState } from "react";
import Geo from "../feature/geocoding";
import NavigationMap from "../feature/navigation-map";
import { MapProvider } from "react-map-gl/mapbox";

export default function Index() {
  const [activeResult, setActiveResult] = useState<"from" | "to" | null>(null);
  return (
    <div className="flex flex-col h-screen">
      {/* 入力エリア */}
      <div className="my-[60px] fixed top-10 z-50 left-1/2 -translate-1/2">
        <Geo position="from" activeResult={activeResult} setActiveResult={setActiveResult} />
        <Geo position="to" activeResult={activeResult} setActiveResult={setActiveResult} />
      </div>

      {/* マップエリア */}
      <div className="flex-1">
        <MapProvider>
          <NavigationMap />
        </MapProvider>
      </div>
    </div>
  );
}
