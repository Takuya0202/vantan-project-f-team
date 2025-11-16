// m => kmに変換してフォーマットする関数
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// 秒 => 分/時間に変換してフォーマットする関数
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}時間${remainingMinutes}分`;
}

// 到着予定時刻を計算する関数
export function calculateArrivalTime(durationSeconds: number): string {
  const now = new Date();
  const arrivalDate = new Date(now.getTime() + durationSeconds * 1000);
  return `${arrivalDate.getHours()}:${arrivalDate.getMinutes().toString().padStart(2, "0")}`;
}
