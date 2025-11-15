// 2点間の距離(案内開始地点と終了地点)の距離を計測するフック
type props = {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
};
export default function useMeasure({ lat1, lng1, lat2, lng2 }: props) {
  // 2点間の距離は地球の半径(R)と中心角θで計算できる。
  const R = 6371;
  // 緯度経度をラジアンに変換
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  // 中心角についてはhaversine公式で求められるらしい。なんでかはしらん
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 距離を計算
  const distance = R * c;
  return distance;
}
function toRad(degres: number) {
  return (degres * Math.PI) / 180;
}
