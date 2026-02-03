import { useState } from "react";
import { EventType } from "../types/Event";

type Coordinate = { latitude: number; longitude: number };

type UseEventFormOptions = {
  defaultCoordinate: Coordinate;
  defaultType?: EventType;
};

type ValidationResult =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; message: string };

export function useEventForm({
  defaultCoordinate,
  defaultType = "Kävely",
}: UseEventFormOptions) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startTime, setStartTime] = useState("");
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());

  const [type, setType] = useState<EventType>(defaultType);

  const [date, setDate] = useState("");
  const [dateValue, setDateValue] = useState<Date>(new Date());

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  const [latitudeInput, setLatitudeInput] = useState(
    defaultCoordinate.latitude.toString()
  );
  const [longitudeInput, setLongitudeInput] = useState(
    defaultCoordinate.longitude.toString()
  );

  const formatTime = (value: Date) =>
    new Intl.DateTimeFormat("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);

  const handleDateSelected = (selected: Date) => {
    setDateValue(selected);
    const iso = selected.toISOString().slice(0, 10);
    setDate(iso);
  };

  const handleStartTimeSelected = (selected: Date) => {
    setStartTimeValue(selected);
    setStartTime(formatTime(selected));
  };

  const formattedDate = date
    ? new Intl.DateTimeFormat("fi-FI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "Valitse päivämäärä";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setDateValue(new Date());
    setStartTime("");
    setStartTimeValue(new Date());
    setType(defaultType);
    setLocationName("");
    setLocationAddress("");
    setLatitudeInput(defaultCoordinate.latitude.toString());
    setLongitudeInput(defaultCoordinate.longitude.toString());
  };

  const validateForm = (): ValidationResult => {
    if (!title || !date || !startTime) {
      return { ok: false, message: "Täytä vähintään nimi, päivä, paikka ja ajat" };
    }

    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (
      !locationName ||
      !locationAddress ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return { ok: false, message: "Täytä sijainti ja kelvolliset koordinaatit" };
    }

    return { ok: true, latitude, longitude };
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    date,
    dateValue,
    formattedDate,
    handleDateSelected,
    startTime,
    startTimeValue,
    handleStartTimeSelected,
    type,
    setType,
    locationName,
    setLocationName,
    locationAddress,
    setLocationAddress,
    latitudeInput,
    setLatitudeInput,
    longitudeInput,
    setLongitudeInput,
    resetForm,
    validateForm,
  };
}
