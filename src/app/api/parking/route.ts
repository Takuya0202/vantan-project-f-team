import { NextResponse } from 'next/server';
import { NearbySearchResponse } from '../../types/parking';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // 緯度経度、またはAPIキーがなければエラー
  if (!lat || !lng) {
    return NextResponse.json(
      { error: '緯度または経度が指定されていません。' },
      { status: 400 }
    );
  }

  const apiKey = process.env.MAPS_API_KEY;

  if (!apiKey) {
    console.error('MAPS_API_KEYが設定されていません。');
    return NextResponse.json(
      { error: 'サーバー側でエラーが発生しました。' },
      { status: 500 }
    );
  }

  // Google Maps APIへのリクエストパラメータ
  const radius = 1000; // 半径1km
  const type = 'parking';
  const language = 'ja';

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&language=${language}&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store', 
    });

    const data: NearbySearchResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error_message || `Google APIエラー: ${response.status}`);
    }

    // Googleからのレスポンスをそのままクライアントに返す
    return NextResponse.json(data);

  } catch (err) {
    console.error('Google Maps APIリクエストエラー:', err);
    const errorMessage = err instanceof Error ? err.message : '不明なエラーです。';
    return NextResponse.json(
      { error: `APIリクエストに失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
