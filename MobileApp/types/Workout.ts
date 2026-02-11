import { RoutePoint } from "./Event";

export type RouteFinal = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  distanceMeters: number;
  avgSpeedMs: number;
  startedAt: number;
  finishedAt: number;
};

export type ChartType = 'Matka' | 'Kesto' | 'Keskinopeus'

export type RecordedEventsList = { eventId: string, final: RouteFinal}[]

