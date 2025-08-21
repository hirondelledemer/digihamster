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

export type GardenConfig = {
  house: { score: number; onClick: () => void };
  tree: { score: number; onClick: () => void };
  shed: { score: number; onClick: () => void };
  animals: { score: number; onClick: () => void };
  river: { score: number; onClick: () => void };
  mountains: { score: number; onClick: () => void };
  pumpkinGarden: { score: number; onClick: () => void };
  defaultScore: { score: number; onClick: () => void };
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
            ? "#87CEEB"
            : defaultScore.score > 40
            ? "#B0C4DE"
            : "#A9A9A9"
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
        <Mountains stage={mountains.score} onClick={mountains.onClick} />
        <BackgroundTrees />
        <River stage={river.score} onClick={river.onClick} />
        <Trees />
        <House stage={house.score} onClick={house.onClick} />
        <Shed stage={shed.score} onClick={shed.onClick} />
        <Rocks />
        <ForegroundTress />
        <PumpkinGarden
          stage={pumpkinGarden.score}
          onClick={pumpkinGarden.onClick}
        />
        <Tree stage={tree.score} onClick={tree.onClick} />
        <Animals stage={animals.score} onClick={animals.onClick} />
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
