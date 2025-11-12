import { NextResponse } from "next/server";
import { db } from "../../../lib/prisma";

// 1. groupBy の結果の型
type LogGroupByResult = {
  place_id: number | null;
  _count: {
    _all: number;
  };
};

// 2. place.findMany の select 結果の型
type SimplePlace = {
  id: number;
  name: string;
};

 //user_logs テーブルを集計し、閲覧数の多い順に場所のリストを返します。
export async function GET(request: Request) {
  try {
    // 1. 直近一週間の開始日時を計算 (7日前の0時0分)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    // 2. user_logs テーブルから集計
    const popularLogs = await db.user_log.groupBy({
      by: ['place_id'],
      _count: {
        _all: true, 
      },
      where: {
        created_at: {
          gte: oneWeekAgo, 
        },
        place_id: {
          not: null, 
        },
      },
      orderBy: {
        _count: {
          _all: 'desc', 
        },
      },
    });

    if (popularLogs.length === 0) {
      return NextResponse.json({ status_code: 200, place: [] });
    }

    // 3. 集計結果から場所IDのリストを取得
    const placeIds = popularLogs
      .map((log: LogGroupByResult) => log.place_id) 
      .filter((id: number | null): id is number => id !== null);

    // 4. place テーブルから該当する場所情報を取得
    const places = await db.place.findMany({
      where: {
        id: {
          in: placeIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // 5. 取得した場所情報をマップに変換 (集計結果との結合を効率化)
    const placeMap = new Map(
      places.map((p: SimplePlace) => [p.id, p.name]) 
    );

    // 6. 最終的なレスポンスデータに整形
    const responseData = popularLogs
      .map((log: LogGroupByResult) => { 
      if (log.place_id === null) {
          return null;
      }
      
      const placeName = placeMap.get(log.place_id);
      if (!placeName) {
          return null;
      }

      return {
        id: log.place_id,
        name: placeName,
        view: log._count._all, 
      };
    })
    .filter((p: string | null): p is NonNullable<typeof p> => p !== null); 

    // 7. 成功レスポンスを返す
    return NextResponse.json({ status_code: 200, place: responseData });

  } catch (error) {
    console.error("Failed to fetch popular places:", error);

    return NextResponse.json(
      { status_code: 500, message: "サーバーエラー" },
      { status: 500 }
    );
  }
}