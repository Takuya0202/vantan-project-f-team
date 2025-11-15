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
  viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewState: (v: { latitude: number; longitude: number; zoom?: number }) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
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
  setPositionFromMap: (position: Position) => set({ positionFromMap: position }),
  setPositionToMap: (position: Position) => set({ positionToMap: position }),
  viewState: {
    latitude: 35.167320433366456,
    longitude: 136.87870458986762,
    zoom: 12,
  },

  // ★ viewState 更新用
  setViewState: (v) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        ...v,
      },
    })),
  isModalOpen: false,
  setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
}));

export default useMap;
