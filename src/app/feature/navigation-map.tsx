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
  const intervalId = useRef<NodeJS.Timeout | null>(null);
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

    // 案内開始後は出発地点のマーカーを表示しない（現在地の緑マーカーで代用）
    if (!isStartedNavigation && positionFromMap.lat && positionFromMap.lng) {
      const fromMarker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat([positionFromMap.lng, positionFromMap.lat])
        .addTo(map.current);
      markers.current.push(fromMarker);
    }

    // 目的地のマーカーは常に表示
    if (positionToMap.lat && positionToMap.lng) {
      const toMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([positionToMap.lng, positionToMap.lat])
        .addTo(map.current);
      markers.current.push(toMarker);
    }
  }, [positionFromMap, positionToMap, isStartedNavigation]);

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
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${directionStartLng},${directionStartLat};${positionToMap.lng},${positionToMap.lat}?geometries=geojson&exclude=unpaved&overview=full&steps=true&language=ja&access_token=${MAPBOX_TOKEN}`;

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

  // 現在地の追跡とナビの自動更新（15秒ごと）
  useEffect(() => {
    if (!isStartedNavigation) return;

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;

          // 前回の位置と比較
          if (lastNavPosition.current) {
            const latDiff = Math.abs(newLat - lastNavPosition.current.lat);
            const lngDiff = Math.abs(newLng - lastNavPosition.current.lng);

            // 約10m以上移動していたら現在地とルートを更新
            if (latDiff > 0.0001 || lngDiff > 0.0001) {
              setCurrentUserPosition({
                latitude: newLat,
                longitude: newLng,
              });
              setPositionFromMap({
                name: "現在地",
                lat: newLat,
                lng: newLng,
              });
              lastNavPosition.current = { lat: newLat, lng: newLng };
            }
          } else {
            // 初回は必ず更新
            setCurrentUserPosition({
              latitude: newLat,
              longitude: newLng,
            });
            setPositionFromMap({
              name: "現在地",
              lat: newLat,
              lng: newLng,
            });
            lastNavPosition.current = { lat: newLat, lng: newLng };
          }
        },
        () => {
          toast.error("現在地の取得に失敗しました。");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    // 15秒ごとに位置情報を更新
    intervalId.current = setInterval(updatePosition, 15000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isStartedNavigation, setCurrentUserPosition, setPositionFromMap]);

  return (
    <div ref={mapboxContainer} className="w-full h-full relative">
      {isStartedNavigation && <NavigationText steps={steps} />}
    </div>
  );
}
