"use client";
import React, { FC } from "react";
import "./style.css";
import { Tree } from "./components/Tree/Tree";

import { Shed } from "./components/Shed/Shed";

import { Grass1, Grass2 } from "./components/Ground/Grass";
import { Clouds } from "./components/Background/Clouds";
import { Mountains } from "./components/Mountains/Mountains";
import { BackgroundTrees } from "./components/Trees/BackgroundTrees";
import { River } from "./components/River/River";
import { Trees } from "./components/Trees/Trees";
import { House } from "./components/House/House";
import { Rocks } from "./components/Ground/Rocks";
import { ForegroundTress } from "./components/Trees/ForegroundTrees";
import { PumpkinGarden } from "./components/PumkinGarden/PumpkinGarden";
import { Animals } from "./components/Animals/Animals";

type ConfigEntity = { score: number; onClick: () => void; withBoosts: boolean };

const SKY_COLOR_1 = "#87CEEB";
const SKY_COLOR_2 = "#B0C4DE";
const SKY_COLOR_3 = "#A9A9A9";

export type GardenConfig = {
  house: ConfigEntity;
  tree: ConfigEntity;
  shed: ConfigEntity;
  animals: ConfigEntity;
  river: ConfigEntity;
  mountains: ConfigEntity;
  pumpkinGarden: ConfigEntity;
  defaultScore: ConfigEntity;
};
export interface GardenProps {
  config: GardenConfig;
}

export const Garden: FC<GardenProps> = ({
  config: {
    house,
    tree,
    shed,
    animals,
    river,
    mountains,
    pumpkinGarden,
    defaultScore,
  },
}) => {
  return (
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky */}
      <rect
        width="600"
        height="400"
        fill={
          defaultScore.score > 70
            ? SKY_COLOR_1
            : defaultScore.score > 40
            ? SKY_COLOR_2
            : SKY_COLOR_3
        }
      />

      {/* Sun/Moon */}
      <circle
        cx="500"
        cy="80"
        r="40"
        fill={defaultScore.score > 50 ? "#FFD700" : "#CCCCCC"}
        className={defaultScore.score > 50 ? "animate-spin-slow" : "opacity-50"}
      />

      <svg viewBox="-20 50 750 400">
        <Grass1 />
        <Grass2 />
        <Clouds />
        <Mountains
          stage={mountains.score}
          onClick={mountains.onClick}
          withBoosts={mountains.withBoosts}
        />
        <BackgroundTrees />
        <River
          stage={river.score}
          onClick={river.onClick}
          withBoosts={river.withBoosts}
        />
        <Trees />
        <House
          stage={house.score}
          onClick={house.onClick}
          withBoosts={house.withBoosts}
        />
        <Shed
          stage={shed.score}
          onClick={shed.onClick}
          withBoosts={shed.withBoosts}
        />
        <Rocks />
        <ForegroundTress />
        <PumpkinGarden
          stage={pumpkinGarden.score}
          onClick={pumpkinGarden.onClick}
          withBoosts={pumpkinGarden.withBoosts}
        />
        <Tree
          stage={tree.score}
          onClick={tree.onClick}
          withBoosts={tree.withBoosts}
        />
        <Animals
          stage={animals.score}
          onClick={animals.onClick}
          withBoosts={animals.withBoosts}
        />
      </svg>

      {/* Fog */}
      {defaultScore.score < 30 && (
        <rect
          width="600"
          height="400"
          fill="white"
          opacity="0.1"
          pointerEvents="none"
        />
      )}
    </svg>
  );
};
