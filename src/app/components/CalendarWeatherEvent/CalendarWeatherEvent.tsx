import React, { FC } from "react";
import {
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconCloudStorm,
  IconQuestionMark,
  IconSun,
} from "@tabler/icons-react";
import { CalendarWeatherEntry } from "../CalendarEvent/CalendarEvent.types";
import { cn } from "../utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface CalendarWeatherEventProps {
  testId?: string;
  event: CalendarWeatherEntry;
  className?: string;
}

const getWeatherIcon = (
  weather: {
    main: string;
  }[]
) => {
  return weather.map((w, index) => {
    switch (w.main) {
      case "Clear":
        return <IconSun key={index} size={14} />;
      case "Clouds":
        return <IconCloud key={index} size={14} />;
      case "Rain":
        return <IconCloudRain aria-label="aa" key={index} size={14} />;
      case "Drizzle":
        return <IconCloudRain key={index} size={14} />;
      case "Thunderstorm":
        return <IconCloudStorm key={index} size={14} />;
      case "Snow":
        return <IconCloudSnow key={index} size={14} />;
      default:
        return <IconQuestionMark key={index} size={14} />;
    }
  });
};

const CalendarWeatherEvent: FC<CalendarWeatherEventProps> = ({
  testId,
  event,
  className,
}): JSX.Element => {
  return (
    <div
      data-testid={testId}
      className={cn(
        "flex text-xs items-center justify-end relative z-10",
        className
      )}
    >
      <div>{Math.floor(event.resource.temp || 0)}</div>

      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <div>{getWeatherIcon(event.resource.weather || [])}</div>
          </TooltipTrigger>
          <TooltipContent>
            {event.resource.weather[0].description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CalendarWeatherEvent;
