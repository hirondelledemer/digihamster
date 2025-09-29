import * as React from "react";
import { SVGProps, useMemo } from "react";
import { Shadow } from "./Shadow";
import { LightGreyTrees } from "./LightGreyTrees";
import { MainShed } from "./MainShed";
import { Bushes } from "./Bushes";
import { WoodChopping } from "./WoodChopping";
import { WaterBucket } from "./WaterBucket";
import { PottedPlant } from "./PottedPlant";
import { WhitePots } from "./WhitePots";
import { Lights } from "./Lights";
import { Ikea } from "./Ikea";
import { DarkTrees } from "./DarkTrees";
import { Flower1 } from "./Flower1";
import { Cactus } from "./Cactus";
import { Flower2 } from "./Flower2";
import { Flower3 } from "./Flower3";
import { Flower4 } from "./Flower4";
import { Flower5 } from "./Flower5";
import { FlowerBush } from "./FlowerBush";
import { Bird1 } from "./Bird1";
import { Bird2 } from "./Bird2";
import { Bird3 } from "./Bird3";
import { Bird4 } from "./Bird4";
import { Bird5 } from "./Bird5";
import { Bird6 } from "./Bird6";
import { DirtyGround } from "./DirtyGround";
import { SmallTrees } from "./SmallTrees";
import { GreyTrees } from "./GreyTrees";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
  MagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";
export interface ShedProps extends SVGProps<SVGSVGElement> {
  stage: number;
  withBoosts?: boolean;
}

export const Shed = ({ stage, withBoosts = false, ...props }: ShedProps) => {
  const component = useMemo(
    () => (
      <>
        <Shadow />
        {stage < 4 && (
          <HauntedWrapper>
            <LightGreyTrees />
          </HauntedWrapper>
        )}
        <MainShed />
        <Bushes />
        {stage > 6 && <WoodChopping />}
        {stage > 4 && <WaterBucket />}
        {stage > 7 && <PottedPlant />}
        {stage > 6 && <WhitePots />}
        {stage > 8 && <Lights />}
        <Ikea />
        {stage > 9 && <Flower1 />}
        {stage > 8 && <Cactus />}
        {stage > 7 && <Flower2 />}
        {stage > 6 && <Flower3 />}
        {stage > 4 && <Flower4 />}
        {stage > 5 && <Flower5 />}
        {stage > 7 && <FlowerBush />}
        {stage > 9 && <Bird1 />}
        {stage > 9 && <Bird2 />}
        {stage > 8 && <Bird3 />}
        {stage > 8 && <Bird4 />}
        {stage > 6 && <Bird5 />}
        {stage > 8 && <Bird6 />}
        {stage < 3 && (
          <HauntedWrapper>
            <DirtyGround />
          </HauntedWrapper>
        )}
        {stage < 3 && (
          <HauntedWrapper>
            <SmallTrees />
          </HauntedWrapper>
        )}
        {stage < 2 && (
          <HauntedWrapper>
            <GreyTrees />
          </HauntedWrapper>
        )}
        {stage < 1 && (
          <HauntedWrapper>
            <DarkTrees />
          </HauntedWrapper>
        )}
      </>
    ),
    [stage]
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -450 1300 1200"
      {...props}
    >
      <HoverMagicalWrapper>
        <MagicalWrapper disabled={!withBoosts}>{component}</MagicalWrapper>
      </HoverMagicalWrapper>
    </svg>
  );
};
