import Image from 'next/image'
import PushPinIcon from '@mui/icons-material/PushPin';
import PinDropIcon from '@mui/icons-material/PinDrop';

type props = {
  value : string,
}
export default function Destination({value} : props) {
  return (
    <div className="mt-[65px]  bg-gray-500 rounded-2xl w-[334px] mx-auto">
        <div className="flex items-center justify-center">
            <div className="flex items-center w-[334px] h-[39px] px-3 border-b-1 border-gray-300">
                <PushPinIcon/>
                <p className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center">
                    現在地
                </p>
                <PushPinIcon className="opacity-0"/>
            </div>
        </div>
        <div className="flex items-center justify-center">
            <div className="flex items-center w-[334px] h-[39px] px-3">
                <PinDropIcon/>
                <p className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center">
                    {value}
                </p>
                <PinDropIcon className="opacity-0"/>
            </div>
        </div>
    </div>
  );
}