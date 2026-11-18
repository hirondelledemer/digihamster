"use client";

import { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { useSearchParams } from "next/navigation";
import { useSetSearchParams } from "@/app/utils/url/search-params";

import { QUERY_KEYS } from "@/app/utils/url/constants";

import { usePersonById } from "@/app/utils/hooks/use-people/selectors";

export const ActivePerson: FC = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const setParams = useSetSearchParams();

  const personId = searchParams.get(QUERY_KEYS.personId);

  const selectedPerson = usePersonById(personId ? Number(personId) : null);

  if (!selectedPerson) {
    return null;
  }

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => setParams("lifeAspectId", null)}
        onEscapeKeyDown={() => setParams("lifeAspectId", null)}
      >
        <SheetHeader>
          <SheetTitle>{selectedPerson.name}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
