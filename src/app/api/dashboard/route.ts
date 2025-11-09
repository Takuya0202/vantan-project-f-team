import { db } from "@/lib/prisma";
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
  const places = await db.log.findMany({
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

  // 今日の走行距離を取得
  const today = new Date();
}