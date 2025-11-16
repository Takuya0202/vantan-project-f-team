export type SearchBoxCoordinates = {
  latitude: number;
  longitude: number;
  accuracy?: string;
  routable_points?: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
};

export type SearchBoxContext = {
  country?: {
    id: string;
    name: string;
    country_code: string;
    country_code_alpha_3: string;
  };
  region?: {
    id: string;
    name: string;
    region_code: string;
    region_code_full: string;
  };
  postcode?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
  place?: {
    id: string;
    name: string;
  };
  neighborhood?: {
    id: string;
    name: string;
  };
  address?: {
    id: string;
    name: string;
    address_number?: string;
    street_name?: string;
  };
  street?: {
    id: string;
    name: string;
  };
};

export type SearchBoxProperties = {
  name: string;
  mapbox_id: string;
  feature_type: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  context?: SearchBoxContext;
  coordinates: SearchBoxCoordinates;
  language?: string;
  maki?: string;
  poi_category?: string[];
  poi_category_ids?: string[];
  external_ids?: Record<string, string>;
  metadata?: Record<string, string>;
};

export type SearchBoxFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: SearchBoxProperties;
};

export type SearchBoxResponse = {
  type: "FeatureCollection";
  features: SearchBoxFeature[];
  attribution: string;
};

// geocodingの結果を格納する型
export type placeItem = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

// Mapbox Directions API の型定義

// 座標の型（経度、緯度の配列）
export type LngLat = [number, number];

// Geometry（GeoJSON形式）
export type DirectionsGeometry = {
  type: "LineString";
  coordinates: LngLat[];
};

// Mapbox Streets v8 のメタデータ
export type MapboxStreetsV8 = {
  class: "street" | "tertiary" | "service" | "primary" | "secondary" | string;
};

// 交差点（Intersection）の情報
export type DirectionsIntersection = {
  location: LngLat;
  bearings: number[];
  entry: boolean[];
  in?: number;
  out?: number;
  geometry_index: number;
  admin_index: number;
  is_urban?: boolean;
  mapbox_streets_v8?: MapboxStreetsV8;
  duration?: number;
  weight?: number;
  turn_weight?: number;
  turn_duration?: number;
  traffic_signal?: boolean;
  stop_sign?: boolean;
};

// 操作指示（Maneuver）
export type DirectionsManeuver = {
  type:
    | "depart"
    | "turn"
    | "arrive"
    | "merge"
    | "on ramp"
    | "off ramp"
    | "fork"
    | "roundabout"
    | string;
  instruction: string;
  bearing_before: number;
  bearing_after: number;
  location: LngLat;
  modifier?:
    | "left"
    | "right"
    | "slight left"
    | "slight right"
    | "sharp left"
    | "sharp right"
    | "straight"
    | "uturn"
    | string;
};

// ステップ（Step）- ターンバイターン案内の各段階
export type DirectionsStep = {
  distance: number;
  duration: number;
  weight: number;
  name: string;
  mode: "driving" | "walking" | "cycling" | string;
  maneuver: DirectionsManeuver;
  intersections: DirectionsIntersection[];
  geometry: DirectionsGeometry;
  driving_side: "left" | "right";
  ref?: string;
  destinations?: string;
  exits?: string;
  pronunciation?: string;
  rotary_name?: string;
  rotary_pronunciation?: string;
};

// 行政区画情報
export type DirectionsAdmin = {
  iso_3166_1: string;
  iso_3166_1_alpha3: string;
};

// レッグ（Leg）- ルートの区間
export type DirectionsLeg = {
  distance: number;
  duration: number;
  weight: number;
  summary: string;
  steps: DirectionsStep[];
  admins: DirectionsAdmin[];
  via_waypoints: DirectionsWaypoint[];
  annotation?: {
    distance?: number[];
    duration?: number[];
    speed?: number[];
    congestion?: string[];
  };
};

// ルート（Route）
export type DirectionsRoute = {
  distance: number;
  duration: number;
  weight: number;
  weight_name: string;
  geometry: DirectionsGeometry;
  legs: DirectionsLeg[];
  routeOptions?: {
    baseUrl?: string;
    user?: string;
    profile?: string;
    coordinates?: LngLat[];
    alternatives?: boolean;
    steps?: boolean;
    continue_straight?: boolean;
    bearings?: string;
    radiuses?: string;
  };
};

// ウェイポイント（Waypoint）
export type DirectionsWaypoint = {
  name: string;
  location: LngLat;
  distance: number;
};

// Directions API のレスポンス全体
export type DirectionsResponse = {
  code: "Ok" | "NoRoute" | "NoSegment" | "ProfileNotFound" | "InvalidInput" | string;
  routes: DirectionsRoute[];
  waypoints: DirectionsWaypoint[];
  uuid: string;
  message?: string; // エラーメッセージ（エラー時）
};
