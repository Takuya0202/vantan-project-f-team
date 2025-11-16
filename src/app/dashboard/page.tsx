import { Card } from "../components/dashboard/card";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import InsightsIcon from "@mui/icons-material/Insights";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import Logout from "../feature/auth/logout";
import History from "../components/dashboard/history";
import { DashboardResponse } from "@/types/dashboard";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";

const getData = async () => {
  const cookie = await cookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
    method: "GET",
    headers: {
      Cookie: cookie.toString(),
    },
    cache: "no-cache",
  });
  if (response.status === 401) {
    redirect("/auth/login");
  }
  const data: DashboardResponse = await response.json();
  return data;
};

async function Content() {
  const data = await getData();
  return (
    <div className="px-2 bg-slate-200 min-h-full">
      <div className="flex flex-col items-center justify-between space-y-8 pt-4 pb-8 bg-slate-200">
        <div className="px-4 flex w-full justify-end h-[13px]">
          <Logout />
        </div>

        <Card
          name="今日の走行距離"
          className=""
          distance={data.distancePerDay}
          divClassName=""
          icon={<TwoWheelerIcon className="mr-7 text-[95px]!" />}
        />
        <Card
          name="一週間の走行距離"
          className=""
          distance={data.distancePerWeek}
          icon={<InsightsIcon className="mr-7 text-[95px]!" />}
        />
        <Card
          name="今までの走行距離"
          className=""
          distance={data.totalDistance}
          icon={<FilterHdrIcon className=" mr-7 text-[95px]! " />}
        />
      </div>
      <div className="bg-white w-[339px] h-[240px] mx-auto rounded-[5px] overflow-y-auto">
        <p className="text-[18px] font-sans font-regular px-4 ">履歴</p>
        {data.places.map((place) => (
          <History name={place.name} key={place.id} />
        ))}
      </div>
    </div>
  );
}

// ここからローディングスケルトン
function Loading() {
  return (
    <div className="px-2 bg-slate-200 min-h-full">
      <div className="flex flex-col items-center justify-between space-y-8 mt-4 mb-8">
        <div className="px-4 flex w-full justify-end h-[13px]">
          <div className="h-[13px] w-[60px] rounded bg-gray-300 animate-pulse" />
        </div>

        <div className="bg-white w-[339px] h-[117px] rounded-[5px] flex justify-between items-center">
          <div className="ml-[20px] space-y-2">
            <div className="h-[14px] w-[120px] bg-gray-200 rounded animate-pulse" />
            <div className="h-[24px] w-[80px] bg-gray-200 rounded animate-pulse" />
          </div>
          <TwoWheelerIcon className="mr-7 text-[95px] text-gray-300" />
        </div>
        <div className="bg-white w-[339px] h-[117px] rounded-[5px] flex justify-between items-center">
          <div className="ml-[20px] space-y-2">
            <div className="h-[14px] w-[120px] bg-gray-200 rounded animate-pulse" />
            <div className="h-[24px] w-[80px] bg-gray-200 rounded animate-pulse" />
          </div>
          <InsightsIcon className="mr-7 text-[95px] text-gray-300" />
        </div>
        <div className="bg-white w-[339px] h-[117px] rounded-[5px] flex justify-between items-center">
          <div className="ml-[20px] space-y-2">
            <div className="h-[14px] w-[120px] bg-gray-200 rounded animate-pulse" />
            <div className="h-[24px] w-[80px] bg-gray-200 rounded animate-pulse" />
          </div>
          <FilterHdrIcon className="mr-7 text-[95px] text-gray-300" />
        </div>
      </div>

      <div className="bg-white w-[339px] h-[240px] mx-auto rounded-[5px] overflow-y-auto p-4">
        <p className="text-[18px] font-sans font-regular mb-2">履歴</p>
        <div className="space-y-2">
          <div className="w-full h-[42px] rounded-[5px] bg-white animate-pulse" />
          <div className="w-full h-[42px] rounded-[5px] bg-white animate-pulse" />
          <div className="w-full h-[42px] rounded-[5px] bg-white animate-pulse" />
          <div className="w-full h-[42px] rounded-[5px] bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}
