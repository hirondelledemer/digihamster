"use client";
import { now } from "@/app/utils/date/date";
import { createContext, ReactNode, useContext, useState } from "react";

interface CalendarDateContextValue {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}
export const CalendarDateContext = createContext<CalendarDateContextValue>({
  selectedDate: now(),
  setSelectedDate: () => {},
});

export const CalendarDateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(now());

  return (
    <CalendarDateContext.Provider
      value={{ selectedDate, setSelectedDate: setSelectedDate }}
    >
      {children}
    </CalendarDateContext.Provider>
  );
};

export const useCalendarDate = () => {
  return useContext(CalendarDateContext);
};
