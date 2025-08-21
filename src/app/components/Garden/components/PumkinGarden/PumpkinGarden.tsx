import React, { FC, SVGProps } from "react";
import { Fence } from "./Fence";
import { DryGarden } from "./DryGarden";
import { Wagon } from "./Wagon";
import { GardenFlowers } from "./GardenFlowers";
import { Flowers1, Flowers2, Flowers3, Flowers4 } from "./Flowers";
import { BackgroundPumpkins } from "./BacgroundPumpkins";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";
import { DryGround } from "./DryGround";
import { DryPlants } from "./DryPlants";

export interface PumpkinGardenProps extends SVGProps<SVGSVGElement> {
  stage: number;
}
export const PumpkinGarden: FC<PumpkinGardenProps> = ({ stage, ...props }) => (
  <g
    style={{}}
    transform="matrix(0.310036, 0, 0, 0.352693, 285.810394, 243.426086)"
    {...props}
  >
    <title>{"Garden"}</title>
    <HoverMagicalWrapper>
      <Fence />
      {stage < 3 && (
        <DryGarden>
          <DryGround />

          {stage < 2 ? (
            <HauntedWrapper>
              <DryPlants />
            </HauntedWrapper>
          ) : (
            <DryPlants />
          )}
        </DryGarden>
      )}
      {stage > 3 && <Wagon />}
      {stage < 5 && <GardenFlowers />}
      {stage > 8 && <Flowers1 />}
      {stage > 7 && <Flowers4 />}
      {stage > 6 && <Flowers2 />}
      {stage > 5 && <Flowers3 />}
      {stage === 5 && <BackgroundPumpkins />}
    </HoverMagicalWrapper>
  </g>
);
