import React, { FC, SVGProps } from "react";
import { Flowers } from "./Flowers";
import { BridgePipe } from "./BridgePipe";
import { WastePipes } from "./WastePipes";
import { Trash } from "./Trash";
import { RiverMainElement } from "./RiverMainElement";
import {
  BridgeFlowers1,
  BridgeFlowers2,
  BridgeFlowers3,
} from "./BridgeFlowers";
import { Bridge } from "./Bridge";
import { BridgeLamps } from "./BridgeLamps";
import { BridgeRuins } from "./BridgeRuins";
import {
  HauntedWrapper,
  HoverWrapper,
  MagicalWrapper,
} from "../MagicalWrapper";

export type RiverProps = {
  stage: number;
  withBoosts: boolean;
} & SVGProps<SVGSVGElement>;

export const River: FC<RiverProps> = ({ stage, withBoosts, ...props }) => (
  <g
    id="freepik--River--inject-256"
    transform="matrix(0.971519, 0, 0, 1, -1.409726, -51.132309)"
    style={{}}
    {...props}
  >
    <HoverWrapper>
      <MagicalWrapper disabled={!withBoosts}>
        {stage < 3 ? (
          <HauntedWrapper>
            <RiverMainElement variant="dark" />
          </HauntedWrapper>
        ) : (
          <RiverMainElement />
        )}
        {stage > 4 && <Flowers />}
        {stage < 3 && <BridgePipe />}
        <g style={{}} transform="matrix(1.029316, 0, 0, 1, 1.45105, 51.132309)">
          <title>{"Bridge"}</title>
          {stage > 8 && <BridgeFlowers3 />}
          {stage > 5 && <Bridge />}
          {stage > 7 && <BridgeLamps />}
          {stage > 6 && <BridgeFlowers2 />}
          {stage > 6 && <BridgeFlowers1 />}
          {stage < 6 && <BridgeRuins />}
        </g>
        {stage < 5 && <WastePipes />}
        {stage < 4 && <Trash />}
      </MagicalWrapper>
    </HoverWrapper>
  </g>
);
