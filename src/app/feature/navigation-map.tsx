"use client";
import useMap from "@/zustand/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import toast from "react-hot-toast";
import { DirectionsResponse, DirectionsStep } from "@/types/mapbox";
import NavigationText from "../components/navigation-text";
import { calculateArrivalTime } from "@/hooks/format";

export default function NavigationMap() {
  const {
    positionFromMap,
    positionToMap,
    viewState,
    isNavigation,
    isStartedNavigation,
    currentUserPosition,
    setCurrentUserPosition,
    setPositionFromMap,
    setRouteInfo,
  } = useMap();

  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxContainer = useRef<HTMLDivElement | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const currentUserMarker = useRef<mapboxgl.Marker | null>(null);
  const [steps, setSteps] = useState<DirectionsStep[]>([]);
  const watchId = useRef<number | null>(null);
  const lastNavUpdateTime = useRef<number>(0);
  const lastNavPosition = useRef<{ lat: number; lng: number } | null>(null);

  // マップの初期化
  useEffect(() => {
    if (!mapboxContainer.current || map.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    map.current = new mapboxgl.Map({
      container: mapboxContainer.current,
      accessToken,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewState.longitude, viewState.latitude],
      zoom: 15,
      maxZoom: 20,
      minZoom: 3,
    });

    const lang = new MapboxLanguage({ defaultLanguage: "ja" });
    map.current.addControl(lang);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [viewState.latitude, viewState.longitude]);

  // viewState変更時
  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter([viewState.longitude, viewState.latitude]);
  }, [viewState.latitude, viewState.longitude]);

  // 出発地点と目的地のマーカー
  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const fromMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([positionFromMap.lng, positionFromMap.lat])
      .addTo(map.current);
    markers.current.push(fromMarker);

    const toMarker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([positionToMap.lng, positionToMap.lat])
      .addTo(map.current);
    markers.current.push(toMarker);
  }, [positionFromMap, positionToMap]);

  // 現在地マーカーの更新とマップ中心の移動
  useEffect(() => {
    if (!map.current || !currentUserPosition.latitude || !currentUserPosition.longitude) return;

    if (currentUserMarker.current) {
      currentUserMarker.current.remove();
    }

    currentUserMarker.current = new mapboxgl.Marker({
      color: "green",
      scale: 0.8,
    })
      .setLngLat([currentUserPosition.longitude, currentUserPosition.latitude])
      .addTo(map.current);

    if (isStartedNavigation) {
      map.current.setCenter([currentUserPosition.longitude, currentUserPosition.latitude]);
    }
  }, [currentUserPosition, isStartedNavigation]);

  // ルート案内の取得と表示
  useEffect(() => {
    if (!isNavigation || !map.current) return;
    if (!positionFromMap.lat || !positionFromMap.lng || !positionToMap.lat || !positionToMap.lng)
      return;

    // ルート案内の開始地点は案内ボタンが押された場合、現在地で設定し、押されてない時は出発地点にする
    const directionStartLng =
      isStartedNavigation && currentUserPosition.longitude
        ? currentUserPosition.longitude
        : positionFromMap.lng;
    const directionStartLat =
      isStartedNavigation && currentUserPosition.latitude
        ? currentUserPosition.latitude
        : positionFromMap.lat;
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${directionStartLng},${directionStartLat};${positionToMap.lng},${positionToMap.lat}?geometries=geojson&exclude=unpaved&steps=true&language=ja&access_token=${MAPBOX_TOKEN}`;

    const fetchRoute = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          toast.error("ルート案内の取得に失敗しました。");
          return;
        }

        const data: DirectionsResponse = await res.json();
        if (!data.routes?.[0]?.legs?.[0]?.steps?.length) {
          toast.error("ルートが見つかりませんでした。");
          return;
        }

        const { geometry: route, distance, duration, legs } = data.routes[0];
        const steps = legs[0].steps;

        setSteps(steps);
        setRouteInfo({
          distance,
          duration,
          arrivalTime: calculateArrivalTime(duration),
        });

        if (!map.current) return;

        // 既存のルートを削除
        if (map.current.getLayer("route")) map.current.removeLayer("route");
        if (map.current.getSource("route")) map.current.removeSource("route");

        // 新しいルートを追加
        map.current.on("load", () => {
          if (!map.current) return;
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
        });
      } catch {
        toast.error("ルート案内の取得に失敗しました。");
      }
    };

    fetchRoute();
  }, [
    isNavigation,
    positionFromMap,
    positionToMap,
    setRouteInfo,
    isStartedNavigation,
    currentUserPosition,
  ]);

  // 現在地の追跡とナビの自動更新
  useEffect(() => {
    if (!map.current) return;

    watchId.current = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        // ナビゲーション中の自動更新チェック
        if (isStartedNavigation) {
          const now = Date.now();
          const timeSinceLastUpdate = now - lastNavUpdateTime.current;

          // 15秒以上経過しているかチェック
          if (timeSinceLastUpdate >= 15000) {
            // 前回の位置と比較
            if (lastNavPosition.current) {
              const latDiff = Math.abs(newLat - lastNavPosition.current.lat);
              const lngDiff = Math.abs(newLng - lastNavPosition.current.lng);

              // 約10m以上移動していたらナビを更新
              if (latDiff > 0.0001 || lngDiff > 0.0001) {
                setCurrentUserPosition({
                  latitude: newLat,
                  longitude: newLng,
                });
                lastNavUpdateTime.current = now;
                lastNavPosition.current = { lat: newLat, lng: newLng };
              }
            } else {
              // 初回
              lastNavPosition.current = { lat: newLat, lng: newLng };
              lastNavUpdateTime.current = now;
            }
          }
        }
      },
      () => {
        toast.error("現在地の追跡に失敗しました。");
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isStartedNavigation, setCurrentUserPosition, setPositionFromMap]);

  return (
    <div ref={mapboxContainer} className="w-full h-full relative">
      {isStartedNavigation && <NavigationText steps={steps} />}
    </div>
  );
}
