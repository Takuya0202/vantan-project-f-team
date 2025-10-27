"use client";
import { Feature, GeocodingResponse } from "@/types/mapbox";
import { useState, useEffect } from "react";
import Input from "../components/geocoding/input";
import Result from "../components/geocoding/result";

export default function Geo() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Feature[] | null>(null);

  useEffect(() => {
    if (!address) return;

    const timeout = setTimeout(async () => {
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
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

  return (
    <main
        className="w-[390px] h-[844px] bg-cover bg-center border"
        // style={{ backgroundImage: "url('/images/map_sample.png')" }}
        // style={result === null ? { backgroundImage: "url('/images/map_sample.png')" } : {}}
    >
      <Input 
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    
       {result && (
        <div>
          {result.map((elem) => (
              <Result id={elem.id} place_name={elem.place_name} key={elem.id}></Result>
          ))}
        </div>
      )} 
      
    </main>
  );
}
