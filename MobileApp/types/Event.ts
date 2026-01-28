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
}
