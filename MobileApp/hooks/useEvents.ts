import { useMemo, useState } from "react";
import { EventType } from "../types/Event";

export function useAddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<EventType>("kävely");

  const [date, setDate] = useState("");
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");

  function handleDateChange(event: { type?: string }, selected?: Date) {
    if (event.type === "set" && selected) {
      setShowDatePicker(false);
      setDateValue(selected);
      const iso = selected.toISOString().slice(0, 10);
      setDate(iso);
      return;
    }
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  }

  const formattedDate = useMemo(() => {
    return date
      ? new Intl.DateTimeFormat("fi-FI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(date))
      : "Valitse päivämäärä";
  }, [date]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setDateValue(new Date());
    setStartTime("");
    setEndTime("");
    setLocationName("");
    setLocationAddress("");
    setLatitudeInput("");
    setLongitudeInput("");
    setShowDatePicker(false);
    setType("kävely");
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    type,
    setType,
    date,
    setDate,
    dateValue,
    setDateValue,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    formattedDate,
    locationName,
    setLocationName,
    locationAddress,
    setLocationAddress,
    latitudeInput,
    setLatitudeInput,
    longitudeInput,
    setLongitudeInput,
    resetForm,
  };
}
