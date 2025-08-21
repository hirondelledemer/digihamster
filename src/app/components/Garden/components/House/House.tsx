import React, { ReactNode, SVGProps } from "react";
import { House1 } from "./House1";
import { House2 } from "./House2";
import { House3 } from "./House3";
import { House4 } from "./House4";
import { House5 } from "./House5";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";

export type HouseProps = {
  stage: number;
} & SVGProps<SVGSVGElement>;

const component: Record<number, ReactNode> = {
  0: (
    <HauntedWrapper>
      <House1 />
    </HauntedWrapper>
  ),
  1: (
    <HauntedWrapper>
      <House1 />
    </HauntedWrapper>
  ),
  2: <House1 />,
  3: <House2 />,
  4: <House2 />,
  5: <House3 />,
  6: <House3 />,
  7: <House4 />,
  8: <House4 />,
  9: <House5 />,
  10: <House5 />,
};
export const House = ({ stage, ...props }: HouseProps) => {
  return (
    <g transform="matrix(1, 0, 0, 1, -73.273476, 28.538858)" {...props}>
      <title>{"House"}</title>
      <HoverMagicalWrapper>{component[stage]}</HoverMagicalWrapper>
    </g>
  );
};
