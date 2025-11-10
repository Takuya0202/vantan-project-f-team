import PinDropIcon from '@mui/icons-material/PinDrop';

type props = {
  value : string,
  onChange : (e : React.ChangeEvent<HTMLInputElement>) => void
}
export default function Input({value , onChange } : props) {
  return (
    <div className="flex items-center justify-center">
        <div className="flex items-center bg-gray-500 rounded-3xl w-[334px] h-[39px] px-3">
            <PinDropIcon/>
            <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="検索"
            className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center"
            />
            <PinDropIcon className="opacity-0"/>
        </div>
    </div>
  );
}