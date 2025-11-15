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
