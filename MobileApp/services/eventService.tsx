import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { EVENT, firestore } from "../firebase/Config";
import { Event } from "../types/Event";

export type CreateEventPayload = Omit<Event, "id">;
export type UpdateEventPayload = Partial<Omit<Event, "id">>;

export async function createEvent(payload: CreateEventPayload): Promise<string> {
  const eventsRef = collection(firestore, EVENT);
  const eventRef = doc(eventsRef);

  await setDoc(eventRef, {
    ...payload,
    id: eventRef.id,
    createdAt: serverTimestamp(),
  });

  return eventRef.id;
}

export async function updateEvent(
  eventId: string,
  payload: UpdateEventPayload
): Promise<void> {
  const eventRef = doc(firestore, EVENT, eventId);

  await updateDoc(eventRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const eventRef = doc(firestore, EVENT, eventId);
  const snap = await getDoc(eventRef);

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data() as Event;
  return { ...data, id: snap.id };
}
