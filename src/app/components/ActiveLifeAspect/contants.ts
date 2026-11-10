import { LifeAspectAsset } from "@/app/utils/types/life-aspect";
import { ReactNode, SVGProps } from "react";
import { House } from "../Garden/components/House";
import { Tree } from "../Garden/components/Tree";
import { Shed } from "../Garden/components/Shed";
import { Animals } from "../Garden/components/Animals";
import { River } from "../Garden/components/River";
import { Mountains } from "../Garden/components/Mountains";
import { PumpkinGarden } from "../Garden/components/PumkinGarden"; // TODO: fix type

type GardenAsset = (
  props: { stage: number; withBoosts: boolean } & SVGProps<SVGSVGElement>
) => ReactNode;

/**
 * Each asset is drawn in the Garden scene's coordinates, so on its own it needs
 * a viewBox framing just that asset. These are the artwork bounds at stages
 * 2-10 plus 4% padding — the haunted-stage mist decorations sit at fixed
 * coordinates well outside the artwork and are deliberately left out of frame.
 */

export const ASPECT_TO_ASSET_MAP: Record<
  LifeAspectAsset,
  { Component: GardenAsset; viewBox: string }
> = {
  house: { Component: House, viewBox: "457 46 335 310" },
  tree: { Component: Tree, viewBox: "-21 59 388 405" },
  shed: { Component: Shed, viewBox: "-2 74 516 455" },
  animals: { Component: Animals, viewBox: "1 57 631 442" },
  river: { Component: River, viewBox: "11 -24 708 621" },
  mountains: { Component: Mountains, viewBox: "17 -10 708 279" },
  pumpkinGarden: { Component: PumpkinGarden, viewBox: "617 255 814 386" },
};
