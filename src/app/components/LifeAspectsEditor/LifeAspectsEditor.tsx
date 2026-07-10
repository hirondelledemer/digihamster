"use client";

import { useEffect, useState } from "react";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { LifeAspect, LifeAspectAsset } from "@/models/life-aspect";
import { api } from "@/app/utils/hooks/use-life-aspects/api";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

const ASSETS: LifeAspectAsset[] = [
  "tree",
  "house",
  "shed",
  "animals",
  "river",
  "mountains",
  "pumpkinGarden",
  "defaultScore",
];

function serialize(lifeAspects: LifeAspect[]): string {
  return lifeAspects
    .map(
      (la) => `${la.id} / ${la.title} / ${la.description ?? ""} / ${la.asset}`,
    )
    .join("\n");
}

function parseLine(line: string): {
  id: string;
  title: string;
  description: string;
  asset: LifeAspectAsset;
} | null {
  const parts = line.split("/").map((p) => p.trim());
  const id = parts[0];
  const title = parts[1];
  if (!title) return null;
  const description = parts[2] ?? "";
  const rawAsset = parts[3] ?? "";
  const asset: LifeAspectAsset = ASSETS.includes(rawAsset as LifeAspectAsset)
    ? (rawAsset as LifeAspectAsset)
    : "defaultScore";
  return { id, title, description, asset };
}

export function LifeAspectsEditor() {
  const { data: lifeAspects, isLoading } = useLifeAspectsState();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setText(serialize(lifeAspects));
    }
  }, [lifeAspects, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const parsed = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map(parseLine)
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const parsedIds = new Set(parsed.map((p) => p.id));

      // Delete life aspects removed from the textarea
      const toDelete = lifeAspects.filter(
        (la) => !parsedIds.has(la.id.toString()),
      );
      await Promise.all(
        toDelete.map((la) => api.deleteLifeAspect(la.id.toString())),
      );

      // Create or update
      await Promise.all(
        parsed.map((item) => {
          if (item.id === "new") {
            return api.createLifeAspect({
              title: item.title,
              description: item.description,
              asset: item.asset,
            });
          }
          return api.updateLifeAspect(item.id.toString(), item);
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-8 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold">Life Aspects</h1>
      <p className="text-sm text-muted-foreground">
        One life aspect per line:{" "}
        <code className="font-mono">title, description, asset</code>
        <br />
        Available assets: {ASSETS.join(", ")}
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={15}
        className="font-mono"
        placeholder={`Health, Improve physical wellbeing, tree\nWork, Career growth, house`}
        disabled={isLoading}
      />
      <Button type="submit" disabled={saving || isLoading}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
