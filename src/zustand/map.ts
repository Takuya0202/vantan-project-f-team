import { create } from "zustand";

// 位置情報の型定義
type Position = {
  name: string;
  lat: number;
  lng: number;
};

// 地図の座標を管理するストア
type MapState = {
  // 出発地点
  positionFromMap: Position;
  // 目的地
  positionToMap: Position;
  // 出発地点を設定
  setPositionFromMap: (position: Position) => void;
  // 目的地を設定
  setPositionToMap: (position: Position) => void;
};

const useMap = create<MapState>((set) => ({
  positionFromMap: {
    name: "",
    lat: 0,
    lng: 0,
  },
  positionToMap: {
    name: "",
    lat: 0,
    lng: 0,
  },
  // 修正: パラメータを受け取って設定する
  setPositionFromMap: (position: Position) => 
    set({ positionFromMap: position }),
  setPositionToMap: (position: Position) => 
    set({ positionToMap: position }),
}));

export default useMap;