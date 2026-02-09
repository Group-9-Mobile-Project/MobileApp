import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoutePoint } from "../types/Event";

const ROUTE_KEY_PREFIX = "event_route:";

export function getRouteStorageKey(eventId: string): string {
  return `${ROUTE_KEY_PREFIX}${eventId}`;
}

export async function loadRoute(eventId: string): Promise<RoutePoint[]> {
  const key = getRouteStorageKey(eventId);
  const json = await AsyncStorage.getItem(key);
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed as RoutePoint[];
  } catch {
    return [];
  }
}

export async function saveRoute(
  eventId: string,
  route: RoutePoint[]
): Promise<void> {
  const key = getRouteStorageKey(eventId);
  await AsyncStorage.setItem(key, JSON.stringify(route));
}

export async function clearRoute(eventId: string): Promise<void> {
  const key = getRouteStorageKey(eventId);
  await AsyncStorage.removeItem(key);
}
