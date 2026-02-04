import { useEffect, useState } from "react";
import { EventType } from "../types/Event";

type Coordinate = { latitude: number; longitude: number };

type UseEventFormInitialValues = {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  type?: EventType;
  locationName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
};

type UseEventFormOptions = {
  defaultCoordinate: Coordinate;
  defaultType?: EventType;
  initialValues?: UseEventFormInitialValues;
};

type ValidationResult =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; message: string };

const parseTimeToDate = (value: string) => {
  const [hours, minutes] = value.split(/[:.]/);
  const date = new Date();
  date.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
  return date;
};

export function useEventForm({
  defaultCoordinate,
  defaultType = "Kävely",
  initialValues,
}: UseEventFormOptions) {
  const initialTitle = initialValues?.title ?? "";
  const initialDescription = initialValues?.description ?? "";
  const initialDate = initialValues?.date ?? "";
  const initialStartTime = initialValues?.startTime ?? "";
  const initialType = initialValues?.type ?? defaultType;

  const initialLocationName = initialValues?.locationName ?? "";
  const initialLocationAddress = initialValues?.locationAddress ?? "";

  const initialLatitude =
    initialValues?.latitude ?? defaultCoordinate.latitude;
  const initialLongitude =
    initialValues?.longitude ?? defaultCoordinate.longitude;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const [startTime, setStartTime] = useState(initialStartTime);
  const [startTimeValue, setStartTimeValue] = useState<Date>(
    initialStartTime ? parseTimeToDate(initialStartTime) : new Date()
  );

  const [type, setType] = useState<EventType>(initialType);

  const [date, setDate] = useState(initialDate);
  const [dateValue, setDateValue] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date()
  );

  const [locationName, setLocationName] = useState(initialLocationName);
  const [locationAddress, setLocationAddress] = useState(initialLocationAddress);

  const [latitudeInput, setLatitudeInput] = useState(
    initialLatitude.toString()
  );
  const [longitudeInput, setLongitudeInput] = useState(
    initialLongitude.toString()
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
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDate(initialDate);
    setDateValue(initialDate ? new Date(initialDate) : new Date());
    setStartTime(initialStartTime);
    setStartTimeValue(
      initialStartTime ? parseTimeToDate(initialStartTime) : new Date()
    );
    setType(initialType);
    setLocationName(initialLocationName);
    setLocationAddress(initialLocationAddress);
    setLatitudeInput(initialLatitude.toString());
    setLongitudeInput(initialLongitude.toString());
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
