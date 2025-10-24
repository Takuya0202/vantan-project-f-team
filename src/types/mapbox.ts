type Geometry = {
    type: "Point";
    coordinates: [number, number];
  };
  
  type Context = {
    id: string;
    text: string;
    [key: string]: any;
  };
  
export type Feature = {
    id: string;
    type: "Feature";
    place_type: string[];
    relevance: number;
    properties: { [key: string]: any };
    text: string;
    place_name: string;
    center: [number, number];
    geometry: Geometry;
    context?: Context[];
  };
  
export type GeocodingResponse = {
    type: "FeatureCollection";
    query: string[];
    features: Feature[];
  };