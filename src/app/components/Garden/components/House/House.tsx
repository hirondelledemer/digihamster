import * as React from "react";
import { SVGProps } from "react";
import { MainHouse } from "./MainHouse";
import { SpiderWebs } from "./SpiderWebs";
import { WoodOnTheWindowBig } from "./WoodOnTheWindowBig";
import { BrokenWindow1, BrokenWindow2 } from "./BrokenWindow";
import { Tire } from "./Tire";
import { Fense } from "./Fense";
import { WasteCan } from "./WasteCan";
import { Cans } from "./Cans";
import { Bottle } from "./Bottle";
import { TrashBags } from "./TrashBags";
import { Fish } from "./Fish";
import { Flies1, Flies2, Flies3 } from "./Flies";
import { WoodOnTheWindowSmall } from "./WoodOnTheWindowSmall";

export type HouseProps = {
  stage: number;
} & SVGProps<SVGSVGElement>;

export const House = ({ stage, ...props }: HouseProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 -400 500 1000" {...props}>
    <g id="freepik--Shadow--inject-64">
      <ellipse
        id="freepik--path--inject-64"
        cx={250}
        cy={416.24}
        rx={193.89}
        ry={11.32}
        style={{
          fill: "rgb(125, 125, 125)",
        }}
      />
    </g>
    <MainHouse />
    {stage < 10 && <SpiderWebs />}
    {stage < 5 && <WoodOnTheWindowBig />}
    {stage < 4 && <WoodOnTheWindowSmall />}
    {stage < 5 && <BrokenWindow1 />}
    {stage < 4 && <BrokenWindow2 />}
    {stage < 8 && <Tire />}
    <Fense />
    {stage < 2 && <WasteCan />}
    {stage < 7 && <Cans />}
    {stage < 6 && <Bottle />}
    {stage < 9 && <TrashBags />}
    {stage < 4 && <Fish />}
    {stage < 4 && <Flies1 />}
    {stage < 9 && <Flies2 />}
    {stage < 6 && <Flies3 />}
  </svg>
);
