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
  }[];
}

function convertVertexesToCoords(vertexes: number[]) {
  const coords: { lat: number; lng: number }[] = [];
  for (let i = 0; i < vertexes.length; i += 2) {
    coords.push({ lng: vertexes[i], lat: vertexes[i + 1] });
  }
  return coords;
}

export function DirecitonRoot(response: DirectionResponse): ParsedRoute[] {
  const { routes, trans_id } = response.data;

  return routes.map((route, idx) => {
    const id = `${trans_id}-${idx}`;
    const from = route.summary.origin.name || '출발지';
    const to = route.summary.destination.name || '도착지';
    const waypointNames = route.summary.waypoints?.map((w) => w.name) || [];

    const distanceText = `${(route.summary.distance / 1000).toFixed(1)}km`;
    const durationMinutes = Math.round(route.summary.duration / 60);
    const durationText = `${durationMinutes}분`;
    const tollFare = route.summary.fare.toll ?? 0;
    const taxiFare = route.summary.fare.taxi ?? 0;

    // 전체 경로 경유 점들 (폴리라인으로 사용 가능)
    const path = route.sections.flatMap((section) =>
      section.roads.flatMap((road) => convertVertexesToCoords(road.vertexes)),
    );

    // 안내 정보 (턴 안내, 도로 이름 등)
    const guide = route.guides.map((g) => ({
      name: g.name ?? '',
      distance: g.distance,
      description: g.guidance ?? '',
      point: { lat: g.y, lng: g.x },
      type: String(g.type),
      duration: g.duration,
      road_index: g.road_index,
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
