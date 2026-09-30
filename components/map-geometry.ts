import type { Place } from "@/app/mock-data";

const MAP_BOUNDS = {
  north: -2.5269,
  south: -2.5331,
  west: -44.3095,
  east: -44.2998,
};

export type MapPoint = { x: number; y: number };

export function getMapPoint(place: Place): MapPoint {
  const x = ((place.coordinates.longitude - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
  const y = ((MAP_BOUNDS.north - place.coordinates.latitude) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;

  return {
    x: Math.min(93, Math.max(7, x)),
    y: Math.min(89, Math.max(11, y)),
  };
}
