import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoutePoint } from "../types/Event";

export type RouteDraft = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  updatedAt: number;
};

export type RouteFinal = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  finishedAt: number;
};

const DRAFT_KEY_PREFIX = "event_route_draft:";
const FINAL_KEY_PREFIX = "event_route_final:";

const getDraftKey = (eventId: string) => `${DRAFT_KEY_PREFIX}${eventId}`;
const getFinalKey = (eventId: string) => `${FINAL_KEY_PREFIX}${eventId}`;

export async function loadRouteDraft(
  eventId: string
): Promise<RouteDraft | null> {
  const json = await AsyncStorage.getItem(getDraftKey(eventId));
  if (!json) return null;
  try {
    return JSON.parse(json) as RouteDraft;
  } catch {
    return null;
  }
}

export async function saveRouteDraft(
  eventId: string,
  draft: RouteDraft
): Promise<void> {
  await AsyncStorage.setItem(getDraftKey(eventId), JSON.stringify(draft));
}

export async function clearRouteDraft(eventId: string): Promise<void> {
  await AsyncStorage.removeItem(getDraftKey(eventId));
}

export async function saveRouteFinal(
  eventId: string,
  finalData: RouteFinal
): Promise<void> {
  await AsyncStorage.setItem(getFinalKey(eventId), JSON.stringify(finalData));
}

export async function loadRouteFinal(
  eventId: string
): Promise<RouteFinal | null> {
  const json = await AsyncStorage.getItem(getFinalKey(eventId));
  if (!json) return null;
  try {
    return JSON.parse(json) as RouteFinal;
  } catch {
    return null;
  }
}

export async function clearRouteFinal(eventId: string): Promise<void> {
  await AsyncStorage.removeItem(getFinalKey(eventId));
}
