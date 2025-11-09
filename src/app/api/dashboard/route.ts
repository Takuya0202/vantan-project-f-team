import { db } from "@/lib/prisma";
import { DashboardResponse } from "@/types/dashboard";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
  // ユーザー情報を取得
  const supabase = await createClient();
  const { data : { user } , error } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId || error) {
    return NextResponse.json({
      error : "Unauthorized",
      message : "ログインが必要です"
    }, { status : 401});
  }

  // ユーザーの履歴を取得する。直近1ヶ月。場所名と緯度経度。
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - 1);

  // 検索した場所
  const userLogs = await db.log.findMany({
    select : {
      createdAt : true,
      place : {
        select : {
          id : true,
          name : true,
          latitude : true,
          longitude : true,
        }
      }
    },
    where : {
      userId : userId,
      createdAt : {
        gte : targetDate,
      }
    },
    orderBy : {
      createdAt : "desc"
    }
  });

  // 走行距離などのデータを取得。
  const navigations = await db.navigation.findMany({
    select : {
      id : true,
      distance : true,
      createdAt : true,
      place : {
        select : {
          id : true,
          name : true,
        }
      }
    },
    where : {
      userId : userId,
    },
    orderBy : {
      createdAt : "desc"
    }
  });

  // 今日の走行距離を取得 0時に設定
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const distancePerDay = navigations.filter(nav => nav.createdAt >= today).map(nav => nav.distance)
  .reduce((prevDistance , currentDistance) => prevDistance + currentDistance, 0);

  // 今週の走行距離
  const week = new Date();
  week.setDate(week.getDate() - 7);
  week.setHours(0, 0, 0, 0);
  const distancePerWeek = navigations.filter(nav => nav.createdAt >= week).map(nav => nav.distance)
  .reduce((prevDistance , currentDistance) => prevDistance + currentDistance, 0);

  // 合計の走行距離
  const totalDistance = navigations.map(nav => nav.distance)
  .reduce((prevDistance , currentDistance) => prevDistance + currentDistance, 0);

  const res : DashboardResponse = {
    places : userLogs.map(log => ({
        id : log.place.id,
        name : log.place.name,
        latitude : log.place.latitude,
        longitude : log.place.longitude,
        createdAt : log.createdAt,
    })),
    navigations : navigations.map(nav => ({
      id : nav.id,
      distance : nav.distance,
      createdAt : nav.createdAt,
      place : {
        id : nav.place.id,
        name : nav.place.name,
      }
    })),
    distancePerDay : distancePerDay,
    distancePerWeek : distancePerWeek,
    totalDistance : totalDistance,
  }

  return NextResponse.json(res , { status : 200 });
}