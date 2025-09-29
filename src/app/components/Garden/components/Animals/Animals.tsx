import React, { SVGProps } from "react";
import { Deer } from "./Deer";
import { TigerDeer } from "./TigerDeer";
import { Seagulls } from "./Seagulls";
import { Crane } from "./Crane";
import { Rabbit } from "./Rabbit";
import { GreyCrane } from "./GrayCrane";
import { Mouse } from "./Mouse";
import { Foxes } from "./Foxes";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
  MagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";

export type AnimalProps = {
  stage: number;
  withBoosts?: boolean;
} & SVGProps<SVGSVGElement>;

export const Animals = ({
  stage,
  withBoosts = false,
  ...props
}: AnimalProps) => (
  <g {...props}>
    <title>{"Animals"}</title>
    <HoverMagicalWrapper>
      <MagicalWrapper disabled={!withBoosts}>
        {stage > 9 && <Deer />}
        {stage < 2 ? (
          <HauntedWrapper>
            <TigerDeer variant="evil" />
          </HauntedWrapper>
        ) : (
          <TigerDeer />
        )}
        {stage > 4 && <Seagulls />}
        {stage > 5 && <Crane />}
        {stage > 6 && <Rabbit />}
        {stage > 7 && <GreyCrane />}
        {stage > 3 && <Mouse />}
        {stage > 8 && <Foxes />}
      </MagicalWrapper>
    </HoverMagicalWrapper>
  </g>
);
