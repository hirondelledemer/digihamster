"use client";
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

export const useProjectLifeAspectAsset = (
  project: IProject | null
): LifeAspectAsset | undefined => useProjectLifeAspect(project)?.asset;

const mapAssetToAnimal: Record<LifeAspectAsset, string> = {
  tree: "\u{1F43F}",
  house: "\u{1F415}",
  river: "\u{1F9A6}",
  mountains: "\u{1F410}",
  pumpkinGarden: "\u{1F99D}",
  animals: "\u{1F426}",
  shed: "\u{1F400}",
};

export const useProjectLifeAspectAssetIcon = (
  project: IProject | null
): string | undefined => {
  const asset = useProjectLifeAspect(project)?.asset;
  if (!asset) {
    return undefined;
  }
  return mapAssetToAnimal[asset];
};
