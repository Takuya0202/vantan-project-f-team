"use client";
import { Card } from "../components/dashboard/card";
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import InsightsIcon from '@mui/icons-material/Insights';
import Footer from "../components/footer";
import Logout from "../feature/auth/logout";
import { DashboardResponse } from "@/types/dashboard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`);
        if (res.status === 200) {
          const errorData = await res.json();
          setError(errorData.message || 'エラーが発生しました');
        }
        else if (res.status === 401) {
          setError('ログインが必要です');
        }
        else {
          const dashboardData: DashboardResponse = await res.json();
          setData(dashboardData);
        }
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>読み込み中...</div>;

  return (
    <div className="h-full px-2">
      <div className="flex flex-col items-center justify-between gap-11 mt-[62px]">
        <Card 
          name="今日の走行距離" 
          className="" 
          distance={data.distancePerDay} 
          divClassName="" 
          icon={<TwoWheelerIcon className='!text-[95px] mr-7' />} 
        />
        <Card 
          name="一週間の走行距離" 
          className="" 
          distance={data.distancePerWeek} 
          icon={<InsightsIcon className='!text-[95px] mr-7' />} 
        />
        <Card 
          name="今までの走行距離" 
          className="" 
          distance={data.totalDistance} 
          icon={<InsightsIcon className='!text-[95px] mr-7' />} 
        />
      </div>
      <Logout />
      <Footer />
    </div>
  );
}