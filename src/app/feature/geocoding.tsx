"use client";
import { Feature, GeocodingResponse } from "@/types/mapbox";
import { useState, useEffect } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Feature[] | null>(null);
  const [showCoords, setShowCoords] = useState(false);

  useEffect(() => {
    if (!address) return;

    const timeout = setTimeout(async () => {
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&language=ja&limit=20`
        );
        if (res.ok) {
          const data: GeocodingResponse = await res.json();
          setResult(data.features);
        }
      } catch (error) {
        console.error(error);
      }
    }, 500); 

    return () => clearTimeout(timeout); 
  }, [address]);

  return (
    <main className="p-5">
      <h1>Mapbox Geocoding</h1>
      <input
        type="text"
        value={address}
        placeholder="住所を入力"
        onChange={(e) => setAddress(e.target.value)}
        className="border rounded-2xl p-2 w-[250px]"
      />
      <button
        onClick={() => setShowCoords((prev) => !prev)}
        className="rounded-lg border transition ml-[10px] p-2"
      >
        {showCoords ? "非表示" : "表示"}
      </button>

      {result && (
        <div>
          {result.map((elem) => (
            <div key={elem.id} className="mt-5">
              <p>📍 <strong>{elem.place_name}</strong></p>
              {showCoords && <p>経度: {elem.center[0]}</p>}
              {showCoords && <p>緯度: {elem.center[1]}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
