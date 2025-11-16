import Link from "next/link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  return (
    <div className="min-h-full bg-slate-200 flex flex-col items-center -mt-10 justify-center px-4">
      <div className="bg-white rounded-[5px] w-full max-w-[339px] p-8 flex flex-col items-center space-y-6">
        <ErrorOutlineIcon className="text-gray-400 text-[120px]" />

        <div className="text-center space-y-2">
          <h1 className="text-[48px] font-bold text-gray-800">404</h1>
          <h2 className="text-[24px] font-semibold text-gray-700">ページが見つかりません</h2>
          <p className="text-[14px] text-gray-500">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>

        <Link
          href="/top"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[16px] font-semibold py-3 px-6 rounded-[5px] text-center transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
