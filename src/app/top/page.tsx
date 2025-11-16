"use client";
import Geo from "../feature/geocoding";
import GetParking from "../feature/getParking";
import NavigationMap from "../feature/navigation-map";
// import StartNavigation from "../feature/startNavigation";
import useMap from "@/zustand/map";
import GeoModal from "../components/modal/geoModal";

export default function Index() {
  const { isModalOpen, isParkingOpen } = useMap();
  return (
    <div className="flex flex-col h-screen">
      {/* 入力エリア */}
      <div className="my-[60px] fixed top-10 z-50 left-1/2 -translate-1/2">
        <Geo position="from" />
        <Geo position="to" />
      </div>

      {/* マップエリア */}
      <div className="flex-1">
        <NavigationMap />
      </div>

      <div>{isModalOpen && <GeoModal />}</div>


    </div>
  );
}
