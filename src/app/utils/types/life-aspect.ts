export type LifeAspectAsset =
  | "tree"
  | "house"
  | "shed"
  | "animals"
  | "river"
  | "mountains"
  | "pumpkinGarden";

export type LifeAspectScore = LifeAspectAsset | "defaultScore";

export type BoostSource = "task" | "habit" | "event" | "manual" | "ai";

export interface LifeAspectBoost {
  id: number;
  life_aspect_id: number;
  value: number;
  source_type: BoostSource;
  source_id: number;
  created_at: string;
}

export interface ILifeAspect {
  id: number;
  title: string;
  description?: string;
  asset: LifeAspectAsset;
  boosts: LifeAspectBoost[];
}
