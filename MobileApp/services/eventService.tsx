import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { EVENT, firestore } from "../firebase/Config";
import { Event } from "../types/Event";

export type CreateEventPayload = Omit<Event, "id">;

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
