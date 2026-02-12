import React, { createContext, useContext, useMemo, useState } from "react";

export type RecordingStatus = "idle" | "recording" | "paused";

type RecordingContextValue = {
  activeEventId: string | null;
  status: RecordingStatus;
  setActiveRecording: (eventId: string, status: RecordingStatus) => void;
  clearActiveRecording: () => void;
};

const RecordingContext = createContext<RecordingContextValue | undefined>(undefined);

export function RecordingProvider({ children }: { children: React.ReactNode }) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [status, setStatus] = useState<RecordingStatus>("idle");

  const value = useMemo<RecordingContextValue>(
    () => ({
      activeEventId,
      status,
      setActiveRecording: (eventId, nextStatus) => {
        setActiveEventId(eventId);
        setStatus(nextStatus);
      },
      clearActiveRecording: () => {
        setActiveEventId(null);
        setStatus("idle");
      },
    }),
    [activeEventId, status]
  );

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>;
}

export function useRecordingContext() {
  const ctx = useContext(RecordingContext);
  if (!ctx) {
    throw new Error("useRecordingContext must be used within RecordingProvider");
  }
  return ctx;
}
