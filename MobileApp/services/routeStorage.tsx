import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoutePoint } from "../types/Event";
import { RouteFinal } from "../types/Workout";

export type { RouteFinal } from "../types/Workout";

export type RouteDraft = {
  route: RoutePoint[];
  elapsedSeconds: number;
  steps: number;
  startedAt?: number;
  updatedAt: number;
};

type RouteFinalStored = Omit<RouteFinal, "startedAt"> & { startedAt?: number };

const DRAFT_KEY_PREFIX = "event_route_draft:";
const FINAL_KEY_PREFIX = "event_route_final:";

const getDraftKey = (eventId: string) => `${DRAFT_KEY_PREFIX}${eventId}`;
const getFinalKey = (eventId: string) => `${FINAL_KEY_PREFIX}${eventId}`;

const normalizeRouteFinal = (finalData: RouteFinalStored): RouteFinal => {
  const startedAt =
    typeof finalData.startedAt === "number"
      ? finalData.startedAt
      : finalData.finishedAt - finalData.elapsedSeconds * 1000;

  return {
    ...finalData,
    startedAt,
  };
};

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
    const parsed = JSON.parse(json) as RouteFinalStored;
    return normalizeRouteFinal(parsed);
  } catch {
    return null;
  }
}

export async function clearRouteFinal(eventId: string): Promise<void> {
  await AsyncStorage.removeItem(getFinalKey(eventId));
}

/**
 * this part is for trainingStatistics.
 */
export async function listRouteFinals(): Promise<
  { eventId: string; final: RouteFinal }[]
> {
  const keys = await AsyncStorage.getAllKeys();
  const finalKeys = keys.filter((key) => key.startsWith(FINAL_KEY_PREFIX));
  if (finalKeys.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(finalKeys);
  const results: { eventId: string; final: RouteFinal }[] = [];

  for (const [key, value] of pairs) {
    if (!value) continue;
    try {
      const parsed = JSON.parse(value) as RouteFinalStored;
      const final = normalizeRouteFinal(parsed);
      const eventId = key.replace(FINAL_KEY_PREFIX, "");
      results.push({ eventId, final });
    } catch {
      // skip invalid
    }
  }

  results.sort((a, b) => b.final.finishedAt - a.final.finishedAt);
  return results;
}