import { create } from "zustand";

// 位置情報の型定義
type Position = {
  name: string;
  lat: number;
  lng: number;
};

// ルート情報の型定義
type RouteInfo = {
  distance: number;
  duration: number;
  arrivalTime: string;
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
  };
  setViewState: (v: { latitude: number; longitude: number; zoom?: number }) => void;
  isNavigation: boolean; // 目的地を選択した時にルートapiをfetchするフラグ
  setIsNavigation: (isNavigation: boolean) => void;
  isStartedNavigation: boolean; // これは案内ボタンを押した時
  setIsStartedNavigation: (isStartedNavigation: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isParkingOpen: boolean;
  setIsParkingOpen: (isParkingOpen: boolean) => void;
  // ユーザーの現在地を格納する
  currentUserPosition: {
    latitude: number | null;
    longitude: number | null;
  };
  setCurrentUserPosition: (currentUserPosition: { latitude: number; longitude: number }) => void;
  // 案内を開始した時の現在地を格納するユーザー位置情報
  startUserPosition: {
    latitude: number | null;
    longitude: number | null;
  };
  setStartUserPosition: (startUserPosition: { latitude: number; longitude: number }) => void;
  // ルート情報
  routeInfo: RouteInfo | null;
  setRouteInfo: (routeInfo: RouteInfo | null) => void;
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
  },
  // ★ viewState 更新用
  setViewState: (viewState: { latitude: number; longitude: number }) => set({ viewState }),
  isNavigation: false,
  setIsNavigation: (isNavigation: boolean) => set({ isNavigation }),
  isStartedNavigation: false,
  setIsStartedNavigation: (isStartedNavigation: boolean) => set({ isStartedNavigation }),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => set({ isModalOpen }),
  isParkingOpen: false,
  setIsParkingOpen: (isParkingOpen: boolean) => set({ isParkingOpen }),
  currentUserPosition: {
    latitude: null,
    longitude: null,
  },
  setCurrentUserPosition: (currentUserPosition: { latitude: number; longitude: number }) =>
    set({ currentUserPosition }),
  startUserPosition: {
    latitude: null,
    longitude: null,
  },
  setStartUserPosition: (startUserPosition: { latitude: number; longitude: number }) =>
    set({ startUserPosition }),
  routeInfo: null,
  setRouteInfo: (routeInfo: RouteInfo | null) => set({ routeInfo }),
}));

export default useMap;
