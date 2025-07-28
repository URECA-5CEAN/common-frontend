import type { DirectionResponse } from '../api/road';

interface ParsedRoute {
  id: string;
  from: string;
  to: string;
  waypointNames: string[];
  distanceText: string;
  durationText: string;
  tollFare: number;
  taxiFare: number;
  path: {
    lat: number;
    lng: number;
  }[];
  guide: {
    name: string;
    description: string;
    point: { lat: number; lng: number };
    type: string;
    duration: number;
    distance: number;
    rode_index: number;
  }[];
}

function convertVertexesToCoords(
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

export function DirecitonRoot(response: DirectionResponse): ParsedRoute[] {
  const { routes, trans_id } = response.data;

  return (routes ?? []).map((route, idx) => {
    const id = `${trans_id}-${idx}`;
    const from = route.summary.origin.name;
    const to = route.summary.destination.name;
    const waypointNames = route.summary.waypoints?.map((w) => w.name) || [];

    const distanceText = `${(route.summary.distance / 1000).toFixed(1)}km`;
    const durationMinutes = Math.round(route.summary.duration / 60);
    const durationText = `${durationMinutes}분`;
    const tollFare = route.summary.fare?.toll ?? 0;
    const taxiFare = route.summary.fare?.taxi ?? 0;

    const path =
      route.sections?.flatMap(
        (section) =>
          section.roads?.flatMap((road) =>
            convertVertexesToCoords(road.vertexes),
          ) ?? [],
      ) ?? [];

    const guide = (route.guides ?? []).map((g) => ({
      name: g.name ?? '',
      description: g.guidance ?? '',
      point: { lat: g.y, lng: g.x },
      distance: g.distance,
      duration: g.duration,
      type: String(g.type),
      rode_index: g.road_index,
    }));

    return {
      id,
      from,
      to,
      waypointNames,
      distanceText,
      durationText,
      tollFare,
      taxiFare,
      path,
      guide,
    };
  });
}
