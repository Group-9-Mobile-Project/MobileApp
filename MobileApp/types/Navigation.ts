import { Event } from "./Event";

export type RootTabParamList = {
  Koti: undefined;
  "Uusi lenkki": undefined;
  Profiili: undefined;
  "Muokkaa tapahtumaa": { eventId: string };
  "Tapahtuman tiedot": { eventId: string};
  "Tallenna tapahtuma": { eventId: string };
  "Harjoituksen tiedot": { eventId: string };
};
