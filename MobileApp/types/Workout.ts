import { RoutePoint } from "./Event";

export type RouteFinal = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  distanceMeters: number;
  avgSpeedMs: number;
  finishedAt: number;
};