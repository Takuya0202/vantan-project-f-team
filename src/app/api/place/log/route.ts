import { db } from "@/lib/prisma";
import { SearchLogResponse } from "@/types/searchLog";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// cookieからplaceIdを取得して、検索履歴を返す。
export async function GET() {
  const cookie = await cookies();
  const raw = cookie.get("placeIds")?.value;
  const placeIds: number[] = raw ? JSON.parse(raw) : [];

  if (placeIds.length > 0) {
    try {
      const logs = await db.place.findMany({
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
        },
        where: {
          id: { in: placeIds },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      const res: SearchLogResponse = logs.map((log) => ({
        id: log.id,
        name: log.name,
        latitude: log.latitude,
        longitude: log.longitude,
      }));
      return NextResponse.json(res, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        {
          error: error,
          message: "検索履歴の取得に失敗しました。",
        },
        { status: 500 }
      );
    }
  }
}
