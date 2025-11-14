import { db } from "@/lib/prisma";
import { recordSchema } from "@/schema/record";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ユーザー情報の取得
  const supabase = await createClient();
  const { data : { user } , error } = await supabase.auth.getUser();
  if (!user || error) {
    return NextResponse.json({
      error : error,
      message : "ユーザー情報の取得に失敗しました。"
    }, { status : 401 })
  }
  const body = await req.json();
  const validatedBody = recordSchema.safeParse(body);
  if (!validatedBody.success) {
    return NextResponse.json({
      error : validatedBody.error,
      message : "走行距離の記録に失敗しました。"
    }, { status : 400 })
  }

  const { placeId , distance } = validatedBody.data;
  try {
    // 走行距離の記録を作成
    await db.navigation.create({
      data : {
        userId :user.id,
        placeId : placeId,
        distance : distance
      },
    })
    return NextResponse.json({
      message : "走行距離を記録しました。"
    }, { status : 200 })
  } catch (error) {
    return NextResponse.json({
      error : error,
      message : "走行距離の記録に失敗しました。"
    } , { status : 500})
  }
}
