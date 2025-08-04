import type { DirectionResponse } from '../api/road';
import type { LocationInfo } from '../pages/MapPage';
import type { RouteItem } from './sidebar/RoadSection';

export function convertVertexesToCoords(
  vertexes: number[] = [],
): { lat: number; lng: number }[] {
  const coords: { lat: number; lng: number }[] = [];
  for (let i = 0; i < vertexes.length; i += 2) {
    if (vertexes[i + 1] !== undefined) {
      coords.push({ lng: vertexes[i], lat: vertexes[i + 1] });
    }
  }
  return coords;
}

export function DirecitonRoot(response: DirectionResponse): RouteItem[] {
  const { routes, id } = response.data;

  return (routes ?? []).map((route) => {
    const directionid = id;
    const from = route.summary.origin.name;
    const to = route.summary.destination.name;
    const waypoints: LocationInfo[] =
      route.summary.waypoints.map((w) => ({
        name: w.name,
        lat: w.y,
        lng: w.x,
        recommendReason: w.recommendReason,
      })) || [];

    const distanceText = `${(route.summary.distance / 1000).toFixed(1)}km`;
    const durationMinutes = Math.round(route.summary.duration / 60);
    const durationText = `${durationMinutes}분`;
    const tollFare = route.summary.fare?.toll ?? 0;
    const taxiFare = route.summary.fare?.taxi ?? 0;

    const path =
      route.sections?.flatMap((section) =>
        section.roads?.flatMap((road) =>
          convertVertexesToCoords(road.vertexes),
        ),
      ) ?? [];

    const road = route.sections?.flatMap((section) =>
      section.roads?.map((road) => ({
        name: road.name,
        distance: road.distance,
        duration: road.duration,
        traffic_state: road.traffic_state,
      })),
    );
    const guide =
      route.sections?.flatMap((section) =>
        section.guides?.map((g) => ({
          name: g.name ?? '',
          description: g.guidance ?? '',
          point: { lat: g.y, lng: g.x },
          distance: g.distance,
          duration: g.duration,
          type: String(g.type),
          rode_index: g.road_index,
        })),
      ) ?? [];
    const section = route.sections || [];
    const recommendReasons = Array.isArray(route.summary?.waypoints)
      ? route.summary.waypoints.map((w) => w.recommendReason ?? '')
      : [];

    const scenario = route?.scenario || undefined;
    const bookmark = response.bookmark ?? false;
    return {
      directionid,
      from,
      to,
      waypoints,
      distanceText,
      durationText,
      tollFare,
      taxiFare,
      path,
      road,
      guide,
      section,
      recommendReasons,
      scenario,
      bookmark,
    };
  });
}
