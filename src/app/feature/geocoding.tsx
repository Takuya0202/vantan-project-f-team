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
  const [selectPlace, setSelectPlace] = useState<{ lat: number; lng: number; place_name: string } | null>(null);

  useEffect(() => {
    if (!address) return;

    const timeout = setTimeout(async () => {
      try {
        const token = MAPBOX_TOKEN;
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&language=ja&limit=10`
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

  if (!MAPBOX_TOKEN) {
    return <div>Mapboxトークンが設定されていません。</div>;
  }

  return (
    <main className="relative w-[390px] h-[844px] border overflow-hidden bg-white">
      {!selectPlace ? (
        <div>
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full">
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: selectPlace.lng,
              latitude: selectPlace.lat,
              zoom: 14,
            }}
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
        { !selectPlace && (
          <Input 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          />
        )}
        {selectPlace && (
          <Destination
          value={selectPlace?.place_name ?? ""}
          />
        )}
        
      
        {result && (
          <div>
            {result.map((elem) => (
                <Result 
                id={elem.id} 
                place_name={elem.place_name} 
                key={elem.id} 
                onClick={() => {
                  setSelectPlace({
                    lat: elem.center[1],
                    lng: elem.center[0],
                    place_name: elem.place_name,
                  });
                  setResult(null);
                }}
              />
            ))}
          </div>
        )} 
      </div>


    </main>
  );
}
