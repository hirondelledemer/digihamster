"use client";

import React, { CSSProperties, FC, useMemo, useRef } from "react";
import { useSelectedEvent } from "@/app/components/ActiveContext/use-selected-event";
import { CalendarEventEntry } from "@/app/components/CalendarEvent/CalendarEvent.types";
import { EventActions } from "@/app/components/EventActions";
import { RelatedEntity } from "@/app/components/EventRelationships/components/RelationshipNavigator/components/RelatedEntity";
import { cn } from "@/app/components/utils";
import { useEventProjectColor } from "@/utils/hooks/use-projects/selectors";
import { useRelationshipTree } from "@/utils/hooks/use-relationships/use-relationship-tree";
import { EventStatus } from "@/utils/types/event";
import { RelationshipEntityType } from "@/utils/types/relationship";
import { useDroppable } from "@dnd-kit/core";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface StatusStyle {
  /** classes on the event block itself */
  container: string;
  /** classes on the title */
  title?: string;
  /** a glyph rendered before the title */
  marker?: string;
  /** a filled block is still happening, an outlined one is not */
  filled: boolean;
}

/**
 * An event that is no longer relevant recedes instead of being decorated:
 * it loses its colour and most of its contrast, and gets both back on
 * hover, when it is being looked at on purpose.
 */
const INACTIVE = "opacity-50 saturate-0 hover:opacity-100 hover:saturate-100";

/**
 * An outlined event has no surface of its own, which is fine until it is
 * hovered: it grows over its neighbours and they would show through, so it
 * takes an opaque background for as long as it is expanded.
 */
const OUTLINED = cn(
  INACTIVE,
  "border-dashed bg-transparent hover:bg-[var(--event-surface)]"
);

/** statuses that are not listed here are drawn as a plain, active event */
const STATUS_STYLES: Partial<Record<EventStatus, StatusStyle>> = {
  [EventStatus.Completed]: {
    container: INACTIVE,
    marker: "\u{2705}",
    filled: true,
  },
  [EventStatus.Cancelled]: {
    container: OUTLINED,
    title: "line-through",
    filled: false,
  },
  [EventStatus.Moved]: {
    container: OUTLINED,
    // the description already carries the date it moved to
    marker: "\u{27B2}",
    filled: false,
  },
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

  const {
    main: projectColor,
    dimmed: projectTint,
    solid: projectSurface,
  } = useEventProjectColor(event.resource.event);

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
  });

  // compact chips only, so there is nothing below the first level to walk
  const { children: related } = useRelationshipTree(
    { id: event.resource.id, type: RelationshipEntityType.Event },
    { depth: 1, on: event.start }
  );

  const status = STATUS_STYLES[event.resource.event.status];
  const isOutlined = status ? !status.filled : false;

  const content = useMemo(() => {
    return (
      <div className="pb-5 h-fit">
        <div className="italic">
          <div className={status?.title}>
            {status?.marker && (
              <span className="pr-1 not-italic">{status.marker}</span>
            )}
            {event.title}
          </div>
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
  }, [
    event.resource.event.description,
    event.title,
    related,
    status?.marker,
    status?.title,
  ]);

  const getBorderColor = () => {
    if (event.resource.id === selectedEvent?.id) {
      return "hsl(var(--primary))";
    }
    // an outlined block has no fill behind it, so the border carries it
    // alone and needs the full strength colour to stay visible
    if (isOutlined) {
      return projectColor || "hsl(var(--primary))";
    }
    return projectTint || "hsl(var(--primary)/0.5)";
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          // an outlined event is left to the classes, an inline background
          // would win over the hover rule that gives it its surface back
          ...(isOutlined
            ? {}
            : { backgroundColor: projectTint || "hsl(var(--card))" }),
          "--event-surface": projectSurface || "hsl(var(--card))",
          // the width and the style stay in classes too, an inline `border`
          // shorthand would win over `border-dashed`
          borderColor: getBorderColor(),
        } as CSSProperties
      }
      className={cn(
        "h-full cursor-pointer rounded-lg relative p-1 border-2",
        status?.container
      )}
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
