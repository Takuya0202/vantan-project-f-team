// ダッシュボードで返却するデータ
export type DashboardResponse = {
  places: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
  }[];
  distancePerDay: number;
  distancePerWeek: number;
  totalDistance: number;
};
