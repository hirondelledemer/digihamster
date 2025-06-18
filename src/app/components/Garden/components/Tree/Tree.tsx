import * as React from "react";
import { SVGProps } from "react";

import "./style.css";
import { Outline } from "./Outline";
import { Shadow } from "./Shadow";
import {
  FallingLeaves1,
  FallingLeaves2,
  FallingLeaves3,
} from "./FallingLeaves";
import { TreeTrunk } from "./TreeTrunk";
import { BROWN_COLOR, GREEN_COLOR } from "./constants";

export const Tree = ({
  stage,
  ...props
}: SVGProps<SVGSVGElement> & { stage: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 700 500"
    {...props}
    className="tree"
  >
    <Shadow />
    <FallingLeaves1 color={stage > 8 ? GREEN_COLOR : BROWN_COLOR} />
    <TreeTrunk stage={stage} />
    <FallingLeaves2 color={stage > 6 ? GREEN_COLOR : BROWN_COLOR} />
    <FallingLeaves3 color={stage > 4 ? GREEN_COLOR : BROWN_COLOR} />
    <Outline />
  </svg>
);
