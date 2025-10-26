"use client";
import React, { useState, useEffect } from 'react';


// 営業時間
type OpeningHours = {
    open_now: boolean; // 現在営業中かどうか
    weekday_text?: string[]; // 週ごとの営業時間テキスト
};

// 取得する駐車場
type PlaceResult = {
    name: string; // 駐車場の名前
    opening_hours?: OpeningHours; // 営業時間
    vicinity?: string; // 住所（参考情報）
};

// APIレスポンス全体の型
type NearbySearchResponse = {
    results: PlaceResult[];
    status: string; // "OK", "ZERO_RESULTS", "REQUEST_DENIED" など
    error_message?: string; // エラー時のメッセージ
};

// 経度緯度
type GetParkingProps = {
    lat: number;
    lng: number;
};

/**
 * 指定された緯度経度から半径1km以内の駐車場情報を取得
 */

export default function GetParking({ lat, lng }: GetParkingProps) {
    const [parkingData, setParkingData] = useState<PlaceResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

    useEffect(() => {
    // 緯度経度が有効な値でなければ処理を中断
    if (!lat || !lng) {
        setLoading(false);
        setError("緯度または経度が無効です。");
        return;
    }

    const fetchParkingData = async () => {
        setLoading(true);
        setError(null);

      // APIリクエストパラメータ
    const radius = 1000; // 半径1km
    const type = 'parking'; // 検索タイプ：駐車場
    const language = 'ja';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&language=${language}&key=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`APIリクエスト失敗: ${response.status}`);
        }

        const data: NearbySearchResponse = await response.json();

        if (data.status === "OK") {
            setParkingData(data.results);
        } else if (data.status === "ZERO_RESULTS") {
            setParkingData([]); // 結果ゼロ件
        } else {
            // "REQUEST_DENIED" (キーが不正など), "INVALID_REQUEST" など
            throw new Error(data.error_message || `APIエラー: ${data.status}`);
        }

        } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("エラーです。");
        }
        console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchParkingData();

    }, [lat, lng]); 
    return (
        <div>
        </div>
    );
};

