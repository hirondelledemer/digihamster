import * as React from "react";
import { SVGProps } from "react";
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
export interface IShedProps extends SVGProps<SVGSVGElement> {
  stage: number;
}

export const Shed = ({ stage, ...props }: IShedProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -450 1300 1200"
    {...props}
  >
    <defs>
      <clipPath id="freepik--clip-path--inject-377">
        <path
          d="M346.45,339.45C343,334,342.56,325.94,346,320.5a21.69,21.69,0,0,1,16.19-9.44,28.49,28.49,0,0,1,18.32,5.09c4.17,2.84,7.67,6.58,11.87,9.38s9,4.58,13.55,6.7a98.06,98.06,0,0,1,49.32,52.06l3.47,6.33c-6.34,2.88-14.57,6.85-21.52,6.49C433,403.55,426.19,408,418.86,410.3S403.71,413,396,412.6a66.79,66.79,0,0,1-21.46-4.24c-6.79-2.75-13-7.23-17-13.38l-1.26,3.5a47.85,47.85,0,0,1-16.1-27.88C338.29,359.82,342.35,349.52,346.45,339.45Z"
          style={{
            fill: "none",
          }}
        />
      </clipPath>
      <clipPath id="freepik--clip-path-2--inject-377">
        <path
          d="M312.93,399.69s-.87-5.21-8.49-14.44c-8-9.68-51.38-64.06-51.38-64.06,3.59-8.53.45-19.1-6.61-25.09s-17.32-7.52-26.19-4.89-16.34,9.05-21.31,16.87c-10.92,17.2-9.82,39.27-6.55,59.39,1.44,8.82,3.25,17.68,6.91,25.84s9.31,15.66,17,20.16c10.83,6.31,24.15,6,36.66,5.19s25.57-2,37.13,2.82c16.34,6.86,15.46,26.21,32.27,31.83,4,1.33,20.28-.17,22.55-3.68,1.92-3,.63-6.91-1-10.07-4.34-8.58-31-38.56-31.05-39.87"
          style={{
            fill: "none",
          }}
        />
      </clipPath>
      <clipPath id="freepik--clip-path-3--inject-377">
        <path
          d="M211.76,358.55a53.43,53.43,0,0,0-2.56-14c-2-5.71-4.64-11.44-9.27-15.31-5.49-4.59-13.22-6-20.25-4.61s-13.4,5.17-18.75,9.92-10,10.65-16,14.86c-6.36,4.51-13.92,6.91-21.08,10s-14.32,7.19-18.38,13.84L88,397.2a414.44,414.44,0,0,0-48.4,36.88C36,437.32,32,442,33.85,446.48s8.27,5.09,13.27,4.47A142.17,142.17,0,0,0,97,435c6.21-3.36,12.37-7.24,19.33-8.39,6.16-1,12.43.22,18.6,1.14,12.76,1.89,25.93,2.45,38.43-.76s24.3-10.54,30.86-21.64c5.86-9.9,7.12-21.79,8-33.26A89.36,89.36,0,0,0,211.76,358.55Z"
          style={{
            fill: "none",
          }}
        />
      </clipPath>
    </defs>
    <Shadow />
    {stage < 4 && <LightGreyTrees />}
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
    {stage < 2 && <DirtyGround />}
    {stage < 3 && <SmallTrees />}
    {stage < 2 && <GreyTrees />}
    {stage < 1 && <DarkTrees />}
  </svg>
);
