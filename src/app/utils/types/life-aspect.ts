export type LifeAspectAsset =
  | "tree"
  | "house"
  | "shed"
  | "animals"
  | "river"
  | "mountains"
  | "pumpkinGarden"
  | "defaultScore";

export interface LifeAspectBoost {
  id: number;
  life_aspect_id: number;
  value: number;
  source_type: "task" | "habit" | "event" | "manual" | "ai";
  source_id: string;
  created_at: string;
}

export interface ILifeAspect {
  id: number;
  title: string;
  description?: string;
  asset: LifeAspectAsset;
  boosts: { value: number; expires: string }[];
}
