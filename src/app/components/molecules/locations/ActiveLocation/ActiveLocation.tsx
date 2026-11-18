"use client";

import { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../ui/sheet";
import { useSearchParams } from "next/navigation";
import { useSetSearchParams } from "@/app/utils/url/search-params";
import { QUERY_KEYS } from "@/app/utils/url/constants";
import { EditableColor } from "../../form/EditableColor";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { useLocationsActions } from "@/app/utils/hooks/use-location/actions-context";

export const ActiveLocation: FC = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const setParams = useSetSearchParams();

  const { update } = useLocationsActions();

  const locationId = searchParams.get(QUERY_KEYS.locationId);

  const selectedLocation = useLocationById(
    locationId ? Number(locationId) : null
  );

  if (!selectedLocation) {
    return null;
  }

  const handleClose = () => setParams(QUERY_KEYS.locationId, null);

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Location info"
        onCloseClick={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <SheetHeader>
          <SheetTitle>{selectedLocation.title}</SheetTitle>
        </SheetHeader>
        <EditableColor
          color={selectedLocation.color}
          onSave={(v) => update(selectedLocation.id, { color: v })}
        />
      </SheetContent>
    </Sheet>
  );
};
