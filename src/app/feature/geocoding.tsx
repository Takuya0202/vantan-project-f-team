"use client";

import { useState, useEffect } from "react";
import { Map, Marker } from 'react-map-gl/mapbox';
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature, GeocodingResponse } from "@/types/mapbox";
import Input from "../components/geocoding/input";
import Result from "../components/geocoding/result";
import Destination from "../components/geocoding/destination";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Geo() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Feature[] | null>(null);

  const [value, setValue] = useState<boolean>(false);

  const handleTrue = () => setValue(true);

  const [selectPlace, setSelectPlace] = useState<{
    lat: number;
    lng: number;
    place_name: string;
  } | null>(null);

  const [viewState, setViewState] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
    zoom: number;
  }>({
    latitude: undefined,
    longitude: undefined,
    zoom: 14,
  });

  useEffect(() => {
    if (!address) return;

    const timeout = setTimeout(async () => {
      try {
        const token = MAPBOX_TOKEN;
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&language=ja&limit=8`
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const crd = pos.coords;
          const currentPlace = {
            lat: crd.latitude,
            lng: crd.longitude,
            place_name: "現在地",
          };
          setSelectPlace(currentPlace);
          setViewState({
            latitude: currentPlace.lat,
            longitude: currentPlace.lng,
            zoom: 14,
          });
        },
        (err) => {
          console.error("位置情報の取得に失敗しました。", err);
          const defaultPlace = {
            lat: 35.167320433366456,
            lng: 136.87870458986762,
            place_name: "vantan名古屋校",
          };
          setSelectPlace(defaultPlace);
          setViewState({
            latitude: defaultPlace.lat,
            longitude: defaultPlace.lng,
            zoom: 14,
          });
        }
      );
    } else {
      console.log("このブラウザではGeolocationはサポートされていません。");
    }
  }, []);

  if (!MAPBOX_TOKEN) {
    return <div>Mapboxトークンが設定されていません。</div>;
  }

  return (
    <main className="relative w-[390px] h-[844px] border overflow-hidden bg-white">
      {!selectPlace ? (
        <div></div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full">
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
          >
            <Marker
              longitude={selectPlace.lng}
              latitude={selectPlace.lat}
              anchor="bottom"
            >
              <img src="/images/location_pin.svg" alt="pin" className="w-5 h-5" />
            </Marker>
          </Map>
        </div>
      )}
      <div className="relative z-10">
        {!value && (
          <Input 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}
        {value && (
          <Destination
            value={address}
            placeholder={selectPlace?.place_name ?? ""}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}

        {result && (
          <div className="overflow-scroll">
            {result.map((elem) => (
              <Result 
                id={elem.id} 
                place_name={elem.place_name} 
                key={elem.id} 
                onClick={() => {
                  const newPlace = {
                    lat: elem.center[1],
                    lng: elem.center[0],
                    place_name: elem.place_name,
                  };
                  setSelectPlace(newPlace);
                  setViewState({
                    latitude: newPlace.lat,
                    longitude: newPlace.lng,
                    zoom: 14,
                  });
                  setResult(null);
                  handleTrue();
                  setAddress("");
                }}
              />
            ))}
          </div>
        )} 
      </div>
    </main>
  );
}