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
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { EditableColor } from "../../form/EditableColor";
import { usePeopleActions } from "@/app/utils/hooks/use-people/actions-context";

export const ActivePerson: FC = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const setParams = useSetSearchParams();

  const { update } = usePeopleActions();

  const personId = searchParams.get(QUERY_KEYS.personId);

  const selectedPerson = usePersonById(personId ? Number(personId) : null);

  if (!selectedPerson) {
    return null;
  }

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Person info"
        onCloseClick={() => setParams(QUERY_KEYS.personId, null)}
        onEscapeKeyDown={() => setParams(QUERY_KEYS.personId, null)}
      >
        <SheetHeader>
          <SheetTitle>{selectedPerson.name}</SheetTitle>
        </SheetHeader>
        <EditableColor
          color={selectedPerson.color}
          onSave={(v) => update(selectedPerson.id, { color: v })}
        />
      </SheetContent>
    </Sheet>
  );
};
