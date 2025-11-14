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
      zoom: viewState.zoom,
    });

    const lang = new MapboxLanguage({ defaultLanguage: "ja" });
    map.current.addControl(lang);

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
  return (
    <div ref={mapboxContainer} className="w-full h-full"></div>
  );
}
