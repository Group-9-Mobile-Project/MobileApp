export type Event = {
  id: string,
  title: string,
  description: string,
  date: string,
  type: EventType,
  location: Location,
  attendees: string[],
  organizer: string,
  startTime: string,
  ownerEmail: string,
}

export type EventType = "Juoksu" | "Kävely";

export interface Location {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EventProps {
  event: Event
}