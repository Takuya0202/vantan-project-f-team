// ダッシュボードで返却するデータ
export type DashboardResponse = {
  places : {
    id : number;
    name : string;
    latitude : number;
    longitude : number;
    createdAt : Date;
  }[];
  navigations : {
    id : number;
    distance : number;
    createdAt : Date;
    place : {
      id : number;
      name : string;
    };
  }[];
  distancePerDay : number;
  distancePerWeek : number;
  totalDistance : number;
}