// 検索履歴の取得でレスポンスする型
export type SearchLogResponse = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}[];
