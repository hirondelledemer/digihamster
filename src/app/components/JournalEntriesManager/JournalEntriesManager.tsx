"use client";
import { FC, useState } from "react";
import { useEntriesState } from "@/app/utils/hooks/use-entry/state-context";
import { useEntriesActions } from "@/app/utils/hooks/use-entry/actions-context";
import RteForm from "../RteForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import MinimalNote from "../MinimalNote";

export interface JournalEntriesManagerProps {
  testId?: string;
}

const JournalEntriesManager: FC<JournalEntriesManagerProps> = ({ testId }) => {
  const { data, isLoading } = useEntriesState();
  const { create, update, delete: remove } = useEntriesActions();

  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div data-testid={testId} className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Journal Entries</h1>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
        </CardHeader>
        <CardContent>
          <RteForm
            submitLabel="Create"
            clearOnSubmit
            onSubmit={({ title, textContent, tags, contentJSON }) =>
              create({
                title,
                note: textContent || "(no content)",
                mentioned_people_ids: tags.map((tag) => Number(tag)),
                json_note: contentJSON,
              })
            }
          />
        </CardContent>
      </Card>

      {isLoading && !data.length ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : null}

      {!isLoading && !data.length ? (
        <p className="text-muted-foreground">No entries yet.</p>
      ) : null}

      <div className="space-y-3">
        {data.map((item) => (
          <Card key={item.id}>
            {editingId === item.id ? (
              <CardContent className="pt-6">
                <RteForm
                  value={item.json_note}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={({ title, textContent, tags, contentJSON }) =>
                    update(
                      item.id,
                      {
                        title,
                        note: textContent || "(no content)",
                        mentioned_people_ids: tags.map((tag) => Number(tag)),
                        json_note: contentJSON,
                      },
                      () => setEditingId(null)
                    )
                  }
                />
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>{item.title || "(untitled)"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">
                    <MinimalNote note={item.json_note}></MinimalNote>
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(item.id)}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JournalEntriesManager;
