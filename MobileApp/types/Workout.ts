import { RoutePoint } from "./Event";

export type RouteFinal = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  distanceMeters: number;
  avgSpeedMs: number;
  startedAt: number;
  finishedAt: number;
  workoutType?: string;
};

export type ChartType = 'Matka' | 'Kesto' | 'Keskinopeus'

export type RecordedEventsList = { eventId: string, final: RouteFinal}[]

