import * as React from "react";
import { SVGProps } from "react";

import "./style.css";

import { Shadow } from "./Shadow";
import {
  FallingLeaves1,
  FallingLeaves2,
  FallingLeaves3,
} from "./FallingLeaves";
import { TreeTrunk } from "./TreeTrunk";
import { BROWN_COLOR, GREEN_COLOR } from "./constants";
import {
  HauntedWrapper,
  HoverMagicalWrapper,
} from "../MagicalWrapper/MagicalWrapper";

export type TreeProps = {
  stage: number;
} & SVGProps<SVGSVGElement>;

export const Tree = ({ stage, ...props }: TreeProps) => {
  const mainTree = React.useMemo(
    () => (
      <HoverMagicalWrapper>
        <FallingLeaves1 color={stage > 8 ? GREEN_COLOR : BROWN_COLOR} />
        <TreeTrunk stage={stage} />
      </HoverMagicalWrapper>
    ),
    [stage]
  );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -10 900 450"
      {...props}
      className="tree"
    >
      <Shadow />
      {stage < 3 ? <HauntedWrapper>{mainTree}</HauntedWrapper> : mainTree}
      <FallingLeaves2 color={stage > 6 ? GREEN_COLOR : BROWN_COLOR} />
      <FallingLeaves3 color={stage > 4 ? GREEN_COLOR : BROWN_COLOR} />
    </svg>
  );
};
