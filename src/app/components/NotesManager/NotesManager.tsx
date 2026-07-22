"use client";
import { FC, useState } from "react";
import { useNotesState } from "@/app/utils/hooks/use-notes/state-context";
import { useNotesActions } from "@/app/utils/hooks/use-notes/actions-context";
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
import { format } from "date-fns";

export interface NotesManagerProps {
  testId?: string;
}

const NotesManager: FC<NotesManagerProps> = ({ testId }) => {
  const { data, isLoading } = useNotesState();
  const { create, update, delete: remove } = useNotesActions();

  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div data-testid={testId} className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Notes</h1>

      <Card>
        <CardHeader>
          <CardTitle>New note</CardTitle>
        </CardHeader>
        <CardContent>
          <RteForm
            submitLabel="Create"
            clearOnSubmit
            onSubmit={({ title, textContent, contentJSON }) =>
              create({
                title,
                content: textContent || "(no content)",
                json_content: contentJSON,
              })
            }
          />
        </CardContent>
      </Card>

      {isLoading && !data.length ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : null}

      {!isLoading && !data.length ? (
        <p className="text-muted-foreground">No notes yet.</p>
      ) : null}

      <div className="space-y-3">
        {data
          .sort(
            (itemA, itemB) =>
              new Date(itemB.created_at).valueOf() -
              new Date(itemA.created_at).valueOf(),
          )
          .map((item) => (
            <Card key={item.id}>
              {editingId === item.id ? (
                <CardContent className="pt-6">
                  <RteForm
                    value={item.json_content}
                    submitLabel="Save"
                    onCancel={() => setEditingId(null)}
                    onSubmit={({ title, textContent, tags, contentJSON }) =>
                      update(
                        item.id,
                        {
                          title,
                          note: textContent || "(no content)",
                          tags,
                          json_note: contentJSON,
                        },
                        () => setEditingId(null),
                      )
                    }
                  />
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>{item.title || "(untitled)"} </CardTitle>
                    <div className="mt-2 text-xs">
                      {format(item.created_at, "yyyy-MM-dd")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">
                      <MinimalNote note={item.json_content}></MinimalNote>
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => remove(item.id)}
                    >
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

export default NotesManager;
