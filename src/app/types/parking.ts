
// 営業時間
export type OpeningHours = {
    open_now: boolean; // 現在営業中かどうか
    weekday_text?: string[]; // 週ごとの営業時間テキスト
};

// 取得する駐車場
export type PlaceResult = {
    name: string; // 駐車場の名前
    opening_hours?: OpeningHours; // 営業時間
    vicinity?: string; // 住所（参考情報）
};

// APIレスポンス全体の型
export type NearbySearchResponse = {
    results: PlaceResult[];
    status: string; // "OK", "ZERO_RESULTS", "REQUEST_DENIED" など
    error_message?: string; // エラー時のメッセージ
    error?: string; // 内部APIからのエラー用
};

// 経度緯度
export type GetParkingProps = {
    lat: number;
    lng: number;
    limit?: number;
};
