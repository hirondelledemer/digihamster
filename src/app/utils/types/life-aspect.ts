export type LifeAspectAsset =
  | "tree"
  | "house"
  | "shed"
  | "animals"
  | "river"
  | "mountains"
  | "pumpkinGarden"
  | "defaultScore";

export interface LifeAspectLog {
  at: number;
  completed: boolean;
}

export interface ILifeAspect {
  id: number;
  title: string;
  description?: string;
  asset: LifeAspectAsset;
  boosts: { value: number; expires: string }[];
}
