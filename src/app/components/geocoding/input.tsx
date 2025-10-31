import Image from 'next/image'

type props = {
  value : string,
  onChange : (e : React.ChangeEvent<HTMLInputElement>) => void
}
export default function Input({value , onChange } : props) {
  return (
    <div className="flex items-center justify-center pt-[65px]">
        <div className="flex items-center bg-gray-500 rounded-3xl w-[334px] h-[39px] px-3">
            <img src="/images/pin.svg" alt="pin" className="w-5 h-5" />
            <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="検索"
            className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-center"
            />
            <img src="/images/pin.svg" alt="" className="w-5 h-5 opacity-0" />
        </div>
    </div>
  );
}