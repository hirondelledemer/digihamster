"use client";
import { format } from "date-fns";
import { FC, useState } from "react";

import { parseBackendDate } from "@/utils/date";
import { now } from "@/app/utils/date/now";
import { useTimeSpacesActions } from "@/app/utils/hooks/use-time-spaces/actions-context";
import { isTimeSpaceActive } from "@/app/utils/hooks/use-time-spaces/selectors";
import { useTimeSpacesState } from "@/app/utils/hooks/use-time-spaces/state-context";
import { ITimeSpace, TimeSpaceKind } from "@/app/utils/types/time-space";

import TimeSpaceForm from "../TimeSpaceForm";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export interface TimeSpacesManagerProps {
  testId?: string;
}

/** The window in words: "Nov 26, 2026 - Nov 28, 2026", "Every December". */
const describeWindow = (timeSpace: ITimeSpace): string => {
  if (timeSpace.kind === TimeSpaceKind.YearlyMonth) {
    const month = format(new Date(2000, timeSpace.params.month - 1, 1), "LLLL");

    return `Every ${month}`;
  }

  const { start, end } = timeSpace.params;
  const from = format(parseBackendDate(start), "PP");

  if (start === end) {
    return from;
  }

  return `${from} - ${format(parseBackendDate(end), "PP")}`;
};

const TimeSpacesManager: FC<TimeSpacesManagerProps> = ({ testId }) => {
  const { data, isLoading } = useTimeSpacesState();
  const { delete: remove } = useTimeSpacesActions();

  const [creating, setCreating] = useState<boolean>(false);
  // the id rather than the row: an edit is optimistic, so a row captured in
  // state here would go stale the moment the form saves
  const [editingId, setEditingId] = useState<number | null>(null);

  const editing = data.find((timeSpace) => timeSpace.id === editingId) ?? null;

  const today = now();

  const sorted = [...data].sort((a, b) => {
    const byActive =
      Number(isTimeSpaceActive(b, today)) - Number(isTimeSpaceActive(a, today));

    return byActive !== 0 ? byActive : a.title.localeCompare(b.title);
  });

  return (
    <div data-testid={testId} className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Time spaces</h1>
        <Button onClick={() => setCreating(true)}>New time space</Button>
      </div>

      {isLoading && !data.length ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : null}

      {!isLoading && !data.length ? (
        <p className="text-muted-foreground">No time spaces yet.</p>
      ) : null}

      <div className="space-y-3">
        {sorted.map((timeSpace) => (
          <Card key={timeSpace.id}>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle
                className="text-base font-normal"
                style={{ color: timeSpace.color }}
              >
                {timeSpace.title}
              </CardTitle>
              {isTimeSpaceActive(timeSpace, today) ? (
                <Badge color={timeSpace.color}>Active now</Badge>
              ) : null}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {describeWindow(timeSpace)}
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingId(timeSpace.id)}
              >
                Edit
              </Button>
              <Button variant="destructive" onClick={() => remove(timeSpace.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New time space</DialogTitle>
            <DialogDescription>
              A window of time you can hang things off.
            </DialogDescription>
          </DialogHeader>
          <TimeSpaceForm onDone={() => setCreating(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit time space</DialogTitle>
            <DialogDescription>{editing?.title}</DialogDescription>
          </DialogHeader>
          {editing ? (
            <TimeSpaceForm
              editMode
              timeSpace={editing}
              onDone={() => setEditingId(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeSpacesManager;
