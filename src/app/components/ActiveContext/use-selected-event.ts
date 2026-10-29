"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  useCurrentEvent,
  useEventById,
} from "@/app/utils/hooks/use-events/selectors";
import { IEvent } from "@/app/utils/types/event";

/**
 * The event the panels are looking at, defaulting to whatever is happening
 * now.
 *
 * Both panels need this and both used to carry their own copy of the effect.
 * They mount side by side, so on a load with no `eventId` the two of them
 * fired the identical `router.replace` in the same tick. Pulling it into one
 * hook also made the dependency list honest: both copies suppressed
 * exhaustive-deps to leave `selectedEventId` out, and with it listed the
 * suppression is no longer needed.
 */
export const useSelectedEvent = (): IEvent | null => {
  const currentEvent = useCurrentEvent();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedEventId = searchParams.get("eventId"); // TODO: convert to number

  useEffect(() => {
    if (!selectedEventId && currentEvent) {
      router.replace(`/?eventId=${currentEvent.id}`, undefined);
    }
  }, [router, currentEvent, selectedEventId]);

  return useEventById(selectedEventId ? Number(selectedEventId) : null);
};
