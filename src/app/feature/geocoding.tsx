"use client";

import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeocodingResponse, placeItem } from "@/types/mapbox";
import Input from "../components/geocoding/input";
import Result from "../components/geocoding/result";
import { SearchLogResponse } from "@/types/searchLog";
import toast from "react-hot-toast";
import useMap from "@/zustand/map";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type GeoProps = {
  position: "from" | "to";
};

export default function Geo({ position }: GeoProps) {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<placeItem[] | null>(null);
  // フォーカスされているinputを管理
  const [focusInput, setFocusInput] = useState<"from" | "to" | null>(null);
  // フォーカスする要素を変更
  const handleFocusChange = (position: "from" | "to") => {
    setFocusInput(position);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocusInput(null);
    }, 100);
  };

  const { positionFromMap, positionToMap, setPositionFromMap, setPositionToMap , setViewState} = useMap();

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
          setViewState({
            latitude : pos.coords.latitude,
            longitude : pos.coords.longitude,
            zoom : 14,
          })
        },
        () => {
          toast.error("位置情報の取得に失敗しました。");
          // デフォルト位置（vantan名古屋校）
          setPosition({
            name: "vantan名古屋校",
            lat: 35.167320433366456,
            lng: 136.87870458986762,
          });
        }
      );
    }
  }, [position, currentPosition.name, setPosition, setViewState]);

  // 履歴の取得をする
  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/place/log`;
      const res = await fetch(url, {
        credentials: "include",
      });
      if (!res.ok) {
        console.log("履歴の取得に失敗しました。");
        return;
      }
      const data: SearchLogResponse = await res.json();
      console.log(data);
      setResult(
        data.map((elem) => ({
          id: elem.id.toString(),
          name: elem.name,
          latitude: elem.latitude,
          longitude: elem.longitude,
        }))
      );
      console.log(result);
    };
    fetchData();
  }, []);

  // ジオコーディングAPI呼び出し（住所検索）
  useEffect(() => {
    if (!address) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&language=ja&limit=8`
        );
        if (res.ok) {
          const data: GeocodingResponse = await res.json();
          setResult(
            data.features.map((feature) => ({
              id: feature.id,
              name: feature.place_name,
              latitude: feature.center[1],
              longitude: feature.center[0],
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [address]);

  // 場所選択時の処理
  const handleSelectPlace = (elem: placeItem) => {
    setPosition({
      name: elem.name,
      lat: elem.latitude,
      lng: elem.longitude,
    });
    if (position === "to") {
      setViewState({
        latitude : elem.latitude,
        longitude : elem.longitude,
        zoom : 12,
      })
    }
    setResult(null);
    setAddress("");
  };

  if (!MAPBOX_TOKEN) {
    return <div>Mapboxトークンが設定されていません。</div>;
  }

  return (
    <div className="w-[390px] relative">
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onFocus={() => handleFocusChange(position)}
        onBlur={() => handleBlur()}
        className={
          position === "from"
            ? !positionToMap.name
              ? "hidden rounded-3xl"
              : "rounded-t-3xl border-white mt-px"
            : position === "to"
              ? positionToMap.name
                ? "rounded-b-3xl"
                : "rounded-3xl"
              : ""
        }
        position={position === "from" ? "from" : "to"}
        placeholder={currentPosition.name ? currentPosition.name : "検索"}
      />
      {result && result.length > 0 && focusInput === position && (
        <div
          className={`absolute left-0 w-full ${position === "from" ? "top-[78px]" : "top-[39px]"}`}
        >
          {result.map((elem) => (
            <Result
              id={elem.id}
              place_name={elem.name}
              key={elem.id}
              onClick={() => handleSelectPlace(elem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}