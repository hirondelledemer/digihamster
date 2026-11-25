"use client";

import React, { FC, useMemo, useRef } from "react";

import { CalendarEventEntry } from "./CalendarEvent.types";

import { useEventProjectColor } from "@/app/utils/hooks/use-projects/selectors";
import { EventActions } from "../EventActions";
import { format } from "date-fns";
import { EventStatus } from "@/app/utils/types/event";
import { cn } from "../utils";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelatedEntity } from "../EventRelationships/components/RelationshipNavigator/components/RelatedEntity/RelatedEntity";
import { useRelationshipTree } from "../../utils/hooks/use-relationships/use-relationship-tree";
import { useSelectedEvent } from "@/app/components/ActiveContext/use-selected-event";

const stripes = (colorVar: string, from: number, to: number) =>
  `repeating-linear-gradient(45deg, hsl(var(${colorVar})/${from}), hsl(var(${colorVar})/${to}) 3px, hsl(var(${colorVar})/0.1) 5px, hsl(var(${colorVar})/0.1) 20px)`;

/** statuses that are not listed here are drawn without an overlay */
const STATUS_STRIPES: Partial<Record<EventStatus, string>> = {
  [EventStatus.Completed]: stripes("--scale-color-10", 0.4, 0.5),
  [EventStatus.Cancelled]: stripes("--scale-color-1", 0.4, 0.5),
  // moved events stay subtler, they are still to be acted on
  [EventStatus.Moved]: stripes("--scale-color-5", 0.1, 0.2),
};

export interface CalendarEventProps {
  event: CalendarEventEntry;
}

const CalendarEvent: FC<CalendarEventProps> = ({
  event,
}): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const selectedEvent = useSelectedEvent();

  const handleMouseEnter = () => {
    const el = containerRef.current;
    if (!el) return;

    el.style.minHeight = `${el.offsetHeight}px`;
    el.style.height = "fit-content";
    el.style.overflow = "visible";
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;

    el.style.minHeight = "";
    el.style.height = "";
    el.style.overflow = "hidden";
  };

  const { dimmed: projectColor } = useEventProjectColor(event.resource.event);

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
  });

  // compact chips only, so there is nothing below the first level to walk
  const { children: related } = useRelationshipTree(
    { id: event.resource.id, type: RelationshipEntityType.Event },
    { depth: 1, on: event.start }
  );

  const content = useMemo(() => {
    return (
      <div className="pb-5 h-fit">
        <div className="italic">
          <div>{event.title}</div>
          <div className="text-xs">{event.resource.event.description}</div>

          <div className="flex pt-2 gap-2">
            {related.map((child) => (
              <RelatedEntity
                key={child.edge?.id ?? child.entity.id}
                node={child}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }, [event.resource.event.description, event.title, related]);

  const statusStripes = STATUS_STRIPES[event.resource.event.status];

  const getBorderColor = () => {
    if (event.resource.id === selectedEvent?.id) {
      return "hsl(var(--primary))";
    }
    if (projectColor) {
      return projectColor;
    }
    return "hsl(var(--primary)/0.5)";
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: projectColor || "hsl(var(--card))",
        border: `2px solid ${getBorderColor()}`,
      }}
      className="h-full cursor-pointer rounded-lg relative p-1"
      onClick={() =>
        router.push(`/?eventId=${event.resource.event.id}`, undefined)
      }
    >
      <div
        ref={setNodeRef}
        // a ring instead of a border, so hovering a dragged event over the
        // slot highlights it without reflowing the content
        className={cn(isOver && "ring-2 ring-primary rounded-lg h-full w-full")}
      >
        <EventActions event={event.resource.event}>
          {statusStripes && (
            <div
              className="absolute inset-0 rounded-md m-px"
              style={{
                background: statusStripes,
              }}
            />
          )}
        </EventActions>
        <div className="text-xs absolute -top-5">
          {format(event.start, "HH:mm")}
        </div>
        <EventActions event={event.resource.event} triggerClassName="h-full">
          {content}
        </EventActions>
        <div className="text-xs absolute -bottom-5">
          {event.end && format(event.end, "HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent;
