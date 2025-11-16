import StartNavigation from "@/app/feature/startNavigation";
import CloseIcon from "@mui/icons-material/Close";
import useMap from "@/zustand/map";

export default function GeoModal() {
  const { isModalOpen, setIsModalClose, isParkingOpen, setIsParkingOpen } = useMap();
  return (
    <div className={`bg-blue-200 rounded-2xl z-50 bottom-0 left-0 w-full fixed ${isParkingOpen ? "h-[400px]" : " h-[150px]"}`}>
      {!isParkingOpen &&
          <button onClick={() => setIsParkingOpen(true)} className="text-center absolute top-[-40px] bg-gray-300 rounded-full right-[122px]">
            周辺の駐車場を探す
          </button>
      }

      <div className="flex justify-end pr-[25px] mt-2.5 relative">
        <div onClick={() => {setIsModalClose(false); setIsParkingOpen(false)}} className="bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center relative z-50">
          <CloseIcon />
        </div>
      </div>
      <div className={`flex justify-between items-center ${isParkingOpen ? "hidden" : ""}`}>
        <div className="ml-[26px]">
          <p className="text-[18px] font-sans font-regular">13分</p>
          <p className="text-[14px] font-sans font-regular">1:00に到着</p>
          <p className="text-[14px] font-sans font-regular">20km</p>
        </div>
        <div className="pr-[25px]">
          <StartNavigation />
        </div>
      </div>
    </div>
  );
}
