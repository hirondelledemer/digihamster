import React, { FC, SVGProps } from "react";
import { BigMountains } from "./BigMountains";
import { Dragon } from "./Dragon";
import { Waterfall } from "./WaterFall";
import { Train } from "./Train";
import { WindTurbines } from "./WindTurbines";
import { SmallMountains } from "./SmallMountains";
import { Rainbow } from "./Rainbow";
import { WaterfallAdvanced } from "./WaterfallAdvanced";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
  MagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";

export interface MountainsProps extends SVGProps<SVGSVGElement> {
  withBoosts: boolean;
  stage: number;
}
export const Mountains: FC<MountainsProps> = ({
  stage,
  withBoosts,
  ...props
}) => (
  <g {...props}>
    <HoverMagicalWrapper>
      <MagicalWrapper disabled={!withBoosts}>
        <title>{"Mountains"}</title>
        {stage > 8 && <Rainbow />}
        {stage > 7 && <Dragon />}

        {stage < 3 ? (
          <HauntedWrapper>
            <BigMountains />
          </HauntedWrapper>
        ) : (
          <BigMountains />
        )}
        {stage < 3 ? (
          <HauntedWrapper>
            <Waterfall variant={"dark"} />
          </HauntedWrapper>
        ) : (
          <Waterfall variant={stage < 4 ? "dark" : "default"} />
        )}

        {stage > 4 && <WaterfallAdvanced />}
        {stage > 5 && <Train />}
        {stage > 6 && <WindTurbines />}
        <SmallMountains />
      </MagicalWrapper>
    </HoverMagicalWrapper>
  </g>
);
