import React, { CSSProperties, FC } from "react";
import { useEventProject } from "@/app/utils/hooks/use-projects/selectors";
import { useSetSearchParams } from "@/app/utils/url/search-params";
import { EventStatus, IEvent } from "@/app/utils/types/event";
import { EventActions } from "@/app/components/EventActions";
import { useCalendarDate } from "@/app/utils/hooks/use-calendar-date";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { cn } from "@/app/components/utils";
import { IconCalendarEvent } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export interface EventCardProps {
  event: IEvent;
}

export const EventCard: FC<EventCardProps> = ({ event }): JSX.Element => {
  const { setSelectedDate } = useCalendarDate();
  const setParams = useSetSearchParams();

  const project = useEventProject(event);

  const getEventStatusColor = () => {
    if (event.status === EventStatus.Cancelled) {
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-1)/0.4), hsl(var(--scale-color-1)/0.5) 3px, hsl(var(--scale-color-1)/0.1) 5px, hsl(var(--scale-color-1)/0.1) 20px)";
    }
    if (event.status === EventStatus.Moved) {
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-5)/0.1), hsl(var(--scale-color-5)/0.2) 3px, hsl(var(--scale-color-5)/0.1) 5px, hsl(var(--scale-color-5)/0.1) 20px)";
    }

    return "";
  };

  const baseStyle: CSSProperties = {
    borderColor: project?.color,
    background: getEventStatusColor(),
  };

  return (
    <EventActions event={event}>
      <Card
        className={cn(
          "p-0 rounded-md w-full",
          event.status !== EventStatus.Pending ? "opacity-40" : ""
        )}
        style={baseStyle}
      >
        <CardHeader className="p-4 pt-2">
          <div
            style={{ color: project?.color }}
            className="text-xxs flex items-center justify-between"
          >
            <span
              className="hover:font-bold cursor-pointer uppercase underline"
              onClick={() =>
                project && setParams("projectId", project?.id.toString())
              }
            >
              {project?.title}
            </span>

            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                setSelectedDate(new Date(event.start_at!));
              }}
            >
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <IconCalendarEvent size={18} />
                </TooltipTrigger>
                <TooltipContent>Show in calendar</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <CardTitle className="font-normal flex items-center justify-between">
            <div
              className={
                event.status === EventStatus.Completed ||
                event.status === EventStatus.Cancelled
                  ? "line-through"
                  : ""
              }
            >
              {event.title}
            </div>
          </CardTitle>
        </CardHeader>
        {event.description &&
          !(
            event.status === EventStatus.Cancelled ||
            event.status === EventStatus.Completed
          ) && (
            <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap">
              {event.description}
            </CardContent>
          )}
      </Card>
    </EventActions>
  );
};
