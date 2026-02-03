import { Event } from "./Event";

export type RootTabParamList = {
  Koti: undefined;
  "Uusi lenkki": undefined;
  Profiili: undefined;
  "Muokkaa tapahtumaa": { eventId: string };
  "Tapahtuman tiedot": { eventId: string}
};
