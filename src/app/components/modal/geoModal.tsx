import StartNavigation from "@/app/feature/startNavigation";
import CloseIcon from "@mui/icons-material/Close";

export default function GeoModal() {
  return (
    <div className="bg-blue-200 rounded-2xl z-50 bottom-0 left-0 w-full h-[150px] fixed">
      <button className="text-center absolute top-[-40px] bg-gray-300 rounded-full right-[122px]">
        周辺の駐車場を探す
      </button>

      <div className="flex justify-end pr-[25px] mt-[10px]">
        <div className="bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center">
          <CloseIcon />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="ml-[26px]">
          <p className="text-[18px] font-sans font-regular">分</p>
          <p className="text-[14px] font-sans font-regular">に到着</p>
          <p className="text-[14px] font-sans font-regular">km</p>
        </div>
        <div className="pr-[25px]">
          <StartNavigation />
        </div>
      </div>
    </div>
  );
}
