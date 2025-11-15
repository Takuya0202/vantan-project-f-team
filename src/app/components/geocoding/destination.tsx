import PushPinIcon from "@mui/icons-material/PushPin";
import PinDropIcon from "@mui/icons-material/PinDrop";

type props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};
export default function Destination({ value, onChange, placeholder }: props) {
  return (
    <div className="mt-[65px]  bg-gray-500 rounded-2xl w-[334px] mx-auto">
      <div className="flex items-center justify-center">
        <div className="flex items-center w-[334px] h-[39px] px-3">
          <PinDropIcon />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center"
          />
          <PinDropIcon className="opacity-0" />
        </div>
      </div>
    </div>
  );
}
