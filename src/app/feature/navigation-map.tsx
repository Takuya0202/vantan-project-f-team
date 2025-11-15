"use client";
import useMap from "@/zustand/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

export default function NavigationMap() {
  const { positionFromMap, positionToMap, viewState } = useMap();
  // stateや変数にしてしまうとレンダリングが走る恐れがあるので。refにする
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxContainer = useRef<HTMLDivElement | null>(null);
  const markers = useRef<mapboxgl.Marker[] | null>(null);

  useEffect(() => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    if (!mapboxContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapboxContainer.current,
      accessToken: accessToken,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewState.longitude, viewState.latitude],
      zoom: 8,
      maxZoom : 8,
      minZoom : 0,
    });

    const lang = new MapboxLanguage({ defaultLanguage: "ja" });
    map.current.addControl(lang);

    // 雨雲レーターのマップ
    map.current.on("load" , () => {
      if (!map.current) return;
      map.current.addSource("rain-rader", {
        type: "raster-array",
        url: "mapbox://mapbox.weather-jp-nowcast",
        tileSize: 512  // ドキュメントでは512が推奨されています
      });
      
      map.current.addLayer({
        id: "rain-rader-layer",
        type: "raster",
        source: "rain-rader",
        "source-layer": "precipitation",
        paint: {
          "raster-color-range": [0, 100],  // 降水量の範囲を設定
          "raster-color": [
            "interpolate",
            ["linear"],
            ["raster-value"],
            0, "rgba(0, 0, 0, 0)",      // 降水なし(透明)
            10, "rgba(0, 255, 0, 0.5)",  // 弱い雨(緑)
            30, "rgba(255, 255, 0, 0.7)", // 中程度の雨(黄)
            50, "rgba(255, 0, 0, 0.9)"   // 強い雨(赤)
          ],
          "raster-opacity": 0.75,
          "raster-fade-duration": 0
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // viewState変更時
  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter([viewState.longitude, viewState.latitude]);
  }, [viewState]);

  // マーカーの変更
  useEffect(() => {
    if (!map.current) return;
    // 既存のマーカーを削除
    markers.current?.forEach((marker) => marker.remove());
    markers.current = [];

    // 出発地点のマーカーを追加
    const fromMarker = new mapboxgl.Marker({
      color: "blue",
    })
      .setLngLat([positionFromMap.lng, positionFromMap.lat])
      .addTo(map.current);
    markers.current.push(fromMarker);

    // 目的地のマーカーを追加
    const toMarker = new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat([positionToMap.lng, positionToMap.lat])
      .addTo(map.current);
    markers.current.push(toMarker);
  }, [positionFromMap, positionToMap]);
  return <div ref={mapboxContainer} className="w-full h-full"></div>;
}
