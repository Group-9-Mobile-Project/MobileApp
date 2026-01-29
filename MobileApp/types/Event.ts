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
  endTime: string,
  ownerEmail: string,
}

export type EventType = "juoksu" | "kävely";

export interface Location {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}