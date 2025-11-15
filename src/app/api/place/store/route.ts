// 案内開始ボタンを押した時のapi
import { db } from "@/lib/prisma";
import { storeSchema } from "@/schema/store";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// 緯度経度取得して、placeに追加。ユーザーのログにも追加。cookieもセット
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validatedBody = storeSchema.safeParse(body);

  if (!validatedBody.success) {
    return NextResponse.json(
      {
        error: validatedBody.error,
        message: "無効なリクエストです。",
      },
      { status: 400 }
    );
  }

  const { name, latitude, longitude } = validatedBody.data;

  // ユーザー情報取得できなくても、エラーにはしない。
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  let placeId: number | null = null;

  // 取得した場所について、新規データなら追加する。
  const isExistPlace = await db.place.findFirst({
    select: {
      id: true,
    },
    where: {
      name: name,
    },
  });

  if (!isExistPlace) {
    try {
      const newPlace = await db.place.create({
        data: {
          name: name,
          latitude: latitude,
          longitude: longitude,
        },
      });
      placeId = newPlace.id;
    } catch (error) {
      return NextResponse.json(
        {
          error: error,
          message: "ナビゲーションの開始に失敗しました。",
        },
        { status: 400 }
      );
    }
  } else {
    placeId = isExistPlace.id;
  }

  // ユーザー情報が存在する場合、ログに追加
  if (user && !error) {
    try {
      // 既にログに追加していた場合は更新する
      const isExisting = await db.log.findFirst({
        where: {
          userId: user.id,
          placeId: placeId,
        },
      });
      if (isExisting) {
        // 既にログに追加していた場合、更新
        await db.log.update({
          where: {
            userId_placeId: {
              userId: user.id,
              placeId: placeId,
            },
          },
          data: {
            updatedAt: new Date(),
          },
        });
      } else {
        // 初めての場所の場合、作成
        await db.log.create({
          data: {
            userId: user.id,
            placeId: placeId,
          },
        });
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: error,
          message: "ナビゲーションの開始に失敗しました。",
        },
        { status: 400 }
      );
    }
  }

  // cookieにplaceIdをセット
  const cookie = await cookies();
  // すでに存在してるcookieの取得
  const raw = cookie.get("placeIds")?.value;
  // json文字列から配列に変換
  const placeIds: number[] = raw ? JSON.parse(raw) : [];
  // 検索した場所がcookieに存在してなかったら追加
  if (!placeIds.includes(placeId)) {
    placeIds.push(placeId);
  }

  cookie.set("placeIds", JSON.stringify(placeIds), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, //30日
    sameSite: "lax",
  });

  return NextResponse.json(
    {
      message: "ナビゲーションの開始に成功しました。",
    },
    { status: 200 }
  );
}
