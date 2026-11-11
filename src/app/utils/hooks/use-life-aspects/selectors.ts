"use client";
import { IHabitWithLogs } from "../../types/habit";
import { ILifeAspect, LifeAspectAsset } from "../../types/life-aspect";
import { IProject } from "../../types/project";
import { useLifeAspectsState } from "./state-context";

export const useLifeAspectById = (
  id: number | null | undefined
): ILifeAspect | null => {
  const { data } = useLifeAspectsState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((la) => la.id === id) ?? null;
};

export const useProjectLifeAspect = (
  project: IProject | null
): ILifeAspect | null => useLifeAspectById(project?.life_aspect_id);

export const useHabitLifeAspect = (
  habit: IHabitWithLogs | null
): ILifeAspect | null => useLifeAspectById(habit?.life_aspect_id);

const mapAssetToAnimal: Record<LifeAspectAsset, string> = {
  tree: "\u{1F43F}",
  house: "\u{1F415}",
  river: "\u{1F9A6}",
  mountains: "\u{1F410}",
  pumpkinGarden: "\u{1F99D}",
  animals: "\u{1F426}",
  shed: "\u{1F400}",
};

/** Use this when the life aspect is already in hand — no extra lookup needed. */
export const getLifeAspectAssetIcon = (
  asset: LifeAspectAsset | undefined
): string | undefined => (asset ? mapAssetToAnimal[asset] : undefined);

export const useProjectLifeAspectAssetIcon = (
  project: IProject | null
): string | undefined =>
  getLifeAspectAssetIcon(useProjectLifeAspect(project)?.asset);

export const useHabitLifeAspectAssetIcon = (
  habit: IHabitWithLogs | null
): string | undefined =>
  getLifeAspectAssetIcon(useHabitLifeAspect(habit)?.asset);
