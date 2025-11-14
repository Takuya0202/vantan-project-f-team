"use client";
import { useState } from "react";
import useMap from "@/zustand/map";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function NavigationMap() {
  const { positionFromMap, positionToMap, viewState, setViewState } = useMap();
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;


  return (
    <div className="relative w-full h-full">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        minZoom={5}
        maxZoom={20}
        zoom={viewState.zoom}
      >
        {/* 出発地のマーカー */}
        {positionFromMap.lat && positionFromMap.lng && (
          <Marker
            longitude={positionFromMap.lng}
            latitude={positionFromMap.lat}
            anchor="bottom"
            color="blue"
          />
        )}
        
        {/* 目的地のマーカー */}
        {positionToMap.lat && positionToMap.lng && (
          <Marker
            longitude={positionToMap.lng}
            latitude={positionToMap.lat}
            anchor="bottom"
            color="black"
          />
        )}
      </Map>
    </div>
  );
}