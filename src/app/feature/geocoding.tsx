"use client";

import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature, GeocodingResponse } from "@/types/mapbox";
import Input from "../components/geocoding/input";
import Result from "../components/geocoding/result";
import useMap from "@/zustand/map";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type GeoProps = {
  position: "from" | "to";
}

export default function Geo({ position }: GeoProps) {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Feature[] | null>(null);

  const { positionFromMap, positionToMap, setPositionFromMap, setPositionToMap } = useMap();

  // ポジションの取得
  const currentPosition = position === "from" ? positionFromMap : positionToMap;
  const setPosition = position === "from" ? setPositionFromMap : setPositionToMap;

  // 初回のみ現在地を取得
  useEffect(() => {
    if (position !== "from" || currentPosition.name) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            name: "現在地",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("位置情報の取得に失敗しました。", err);
          // デフォルト位置（vantan名古屋校）
          setPosition({
            name: "vantan名古屋校",
            lat: 35.167320433366456,
            lng: 136.87870458986762,
          });
        }
      );
    }
  }, [position, currentPosition.name, setPosition]);

  // ジオコーディングAPI呼び出し（住所検索）
  useEffect(() => {
    if (!address) {
      setResult(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&language=ja&limit=8`
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

  // 場所選択時の処理
  const handleSelectPlace = (feature: Feature) => {
    setPosition({
      name: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setResult(null);
    setAddress("");
  };

  if (!MAPBOX_TOKEN) {
    return <div>Mapboxトークンが設定されていません。</div>;
  }

  return (
    <div className="w-full">
        <Input 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      {result && result.length > 0 && (
        <div>
          {result.map((elem) => (
            <Result 
              id={elem.id} 
              place_name={elem.place_name} 
              key={elem.id} 
              onClick={() => handleSelectPlace(elem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}