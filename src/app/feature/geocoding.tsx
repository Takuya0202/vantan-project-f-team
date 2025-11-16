"use client";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchBoxResponse, placeItem } from "@/types/mapbox";
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
  const { setIsModalOpen } = useMap();

  // フォーカスされているinputを管理
  const [focusInput, setFocusInput] = useState<"from" | "to" | null>(null);
  // 現在地取得。search Boxで使う
  const [coord, setCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  // フォーカスする要素を変更
  const handleFocusChange = (position: "from" | "to") => {
    setFocusInput(position);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocusInput(null);
    }, 100);
  };

  const {
    positionFromMap,
    positionToMap,
    setPositionFromMap,
    setPositionToMap,
    setViewState,
    setIsNavigation,
  } = useMap();

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
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setCoord({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          toast.error("位置情報の取得に失敗しました。");
          // デフォルト位置（vantan名古屋校）
          setPosition({
            name: "vantan名古屋校",
            lat: 35.167320433366456,
            lng: 136.87870458986762,
          });
        },
        {
          enableHighAccuracy: true,
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
      setResult(
        data.map((elem) => ({
          id: elem.id.toString(),
          name: elem.name,
          latitude: elem.latitude,
          longitude: elem.longitude,
        }))
      );
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
        let url = "";
        // ２回目以降の検索だと、モーダルが邪魔なので閉じる
        setIsModalOpen(false);
        if (coord) {
          url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(address)}&country=JP&language=ja&limit=8&proximity=${coord.longitude},${coord.latitude}&access_token=${MAPBOX_TOKEN}`;
        } else {
          url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(address)}&country=JP&language=ja&limit=8&access_token=${MAPBOX_TOKEN}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data: SearchBoxResponse = await res.json();
          setResult(
            data.features.map((feature) => ({
              id: feature.properties.mapbox_id,
              name: feature.properties.name,
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
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
        latitude: elem.latitude,
        longitude: elem.longitude,
      });
      setIsModalOpen(true);
    }
    setIsNavigation(true);
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
