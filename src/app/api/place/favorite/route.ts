import { db } from "@/lib/prisma";
import { FavoriteSpotResponse } from "@/types/favoriteSpot";
import { NextResponse } from "next/server";

export async function GET() {
  // 人気スポットの取得
  try {
    const favoritePlaces = await db.place.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { logs: true } },
      },
      orderBy: { logs: { _count: "desc" } },
      take: 10,
    });
    const res: FavoriteSpotResponse = favoritePlaces.map((place) => ({
      id: place.id,
      name: place.name,
      view: place._count.logs,
    }));

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
        message: "人気スポットの取得に失敗しました。",
      },
      { status: 500 }
    );
  }
}
