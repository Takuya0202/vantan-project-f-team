"use client";
import useMap from "@/zustand/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import toast from "react-hot-toast";
import { DirectionsResponse, DirectionsStep } from "@/types/mapbox";
import NavigationText from "../components/navigation-text";

export default function NavigationMap() {
  const { positionFromMap, positionToMap, viewState, isNavigation, isStartedNavigation } = useMap();
  // stateや変数にしてしまうとレンダリングが走る恐れがあるので。refにする
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxContainer = useRef<HTMLDivElement | null>(null);
  const markers = useRef<mapboxgl.Marker[] | null>(null);
  const [steps, setSteps] = useState<DirectionsStep[]>([]);
  useEffect(() => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    if (!mapboxContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapboxContainer.current,
      accessToken: accessToken,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewState.longitude, viewState.latitude],
      zoom: 8,
      maxZoom: 20,
      minZoom: 3,
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

  // ルート案内
  useEffect(() => {
    if (!isNavigation || !map.current) return;
    if (!positionFromMap.lat || !positionFromMap.lng || !positionToMap.lat || !positionToMap.lng)
      return;

    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${positionFromMap.lng},${positionFromMap.lat};${positionToMap.lng},${positionToMap.lat}?geometries=geojson&exclude=unpaved&steps=true&language=ja&access_token=${MAPBOX_TOKEN}`;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          toast.error("ルート案内の取得に失敗しました。");
          return;
        }
        const data: DirectionsResponse = await res.json();
        // データの存在確認
        if (
          !data.routes ||
          data.routes.length === 0 ||
          !data.routes[0].legs ||
          data.routes[0].legs[0].steps.length === 0
        ) {
          toast.error("ルートが見つかりませんでした。");
          return;
        }
        // ルートの線
        const route = data.routes[0].geometry;
        // 案内
        const steps = data.routes[0].legs[0].steps;
        setSteps(steps);

        if (!map.current) return;

        // 既存のルートレイヤーとソースを削除
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
        }
        if (map.current.getSource("route")) {
          map.current.removeSource("route");
        }
        // ルートをマップに追加
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("ルート案内の取得に失敗しました。");
      }
    };

    fetchData();
  }, [isNavigation, positionFromMap, positionToMap]);
  return (
    <div ref={mapboxContainer} className="w-full h-full relative">
      {isStartedNavigation && <NavigationText steps={steps} />}
    </div>
  );
}
