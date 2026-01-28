export type Event = {
  id: string,
  title: string,
  description: string,
  date: string,
  location: Location,
  attendees: string[],
  organizer: string,
  startTime: string,
  endTime: string,
  ownerEmail: string,
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}