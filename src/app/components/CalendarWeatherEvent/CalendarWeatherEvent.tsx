import React, { FC } from "react";
import { IconCloud, IconCloudRain, IconSun } from "@tabler/icons-react";
import { CalendarWeatherEntry } from "../CalendarEvent/CalendarEvent.types";

export interface CalendarWeatherEventProps {
  testId?: string;
  event: CalendarWeatherEntry;
}

const getWeatherIcon = (
  weather: {
    main: string;
  }[]
) => {
  return weather.map((w, index) => {
    if (w.main === "Clear") {
      return <IconSun key={index} size={14} />;
    }
    if (w.main === "Clouds") {
      return <IconCloud key={index} size={14} />;
    }
    if (w.main === "Rain") {
      return <IconCloudRain key={index} size={14} />;
    }
    return w.main;
  });
};

const CalendarWeatherEvent: FC<CalendarWeatherEventProps> = ({
  testId,
  event,
}): JSX.Element => {
  return (
    <div
      data-testid={testId}
      className="pt-1 flex text-xs items-center pointer-events-none justify-end relative z-10"
    >
      <div>{Math.floor(event.resource.temp || 0)}</div>
      <div>{getWeatherIcon(event.resource.weather || [])}</div>
    </div>
  );
};

export default CalendarWeatherEvent;
