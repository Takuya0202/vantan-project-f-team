import PushPinIcon from "@mui/icons-material/PushPin";
import PinDropIcon from "@mui/icons-material/PinDrop";

type props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  position?: "from" | "to";
  placeholder: string;
  onFocus: () => void;
  onBlur: () => void;
};
export default function Input({
  value,
  onChange,
  className,
  position,
  placeholder,
  onFocus,
  onBlur,
}: props) {
  return (
    <div className="flex items-center justify-center">
      <div className={`flex items-center bg-gray-500 w-[334px] h-[39px] px-3 ${className || ""}`}>
        {position === "from" ? <PushPinIcon /> : <PinDropIcon />}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center placeholder:opacity-80
          text-base"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <PinDropIcon className="opacity-0" />
      </div>
    </div>
  );
}
