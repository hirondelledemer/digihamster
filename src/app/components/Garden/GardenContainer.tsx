"use client";
import React, { FC, useState } from "react";
import "./style.css";

import useHabits from "#src/app/utils/hooks/use-habits";
import {
  getHabitProgressForLifeAspect,
  hasActiveBoosts,
} from "#src/app/utils/habits/getHabitProgress";
import { Button } from "../ui/button";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Garden, GardenConfig } from "./Garden";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";

export const GardenContainer: FC<{
  onAssetClickAction: (category?: string) => void;
}> = ({ onAssetClickAction: onAssetClick }) => {
  const [score, setScore] = useState(100);
  const { data: habits } = useHabits();
  const { data: lifeAspects } = useLifeAspectsState();

  const treeLifeAspect = lifeAspects.find((la) => la.asset === "tree");
  const houseLifeAspect = lifeAspects.find((la) => la.asset === "house");
  const shedLifeAspect = lifeAspects.find((la) => la.asset === "shed");
  const animalsLifeAspect = lifeAspects.find((la) => la.asset === "animals");
  const riverLifeAspect = lifeAspects.find((la) => la.asset === "river");
  const mountainsLifeAspect = lifeAspects.find(
    (la) => la.asset === "mountains"
  );
  const pumpkinsLifeAspect = lifeAspects.find(
    (la) => la.asset === "pumpkinGarden"
  );

  const treeScore = Math.floor(
    getHabitProgressForLifeAspect(habits, treeLifeAspect || [], true) / 10
  );
  const houseScore = Math.floor(
    getHabitProgressForLifeAspect(habits, houseLifeAspect || [], true) / 10
  );
  const shedScore = Math.floor(
    getHabitProgressForLifeAspect(habits, shedLifeAspect || [], true) / 10
  );

  console.log("shedScore", shedScore);
  const animalsScore = Math.floor(
    getHabitProgressForLifeAspect(habits, animalsLifeAspect || [], true) / 10
  );
  const riverScore = Math.floor(
    getHabitProgressForLifeAspect(habits, riverLifeAspect || [], true) / 10
  );

  const mountainsScore = Math.floor(
    getHabitProgressForLifeAspect(habits, mountainsLifeAspect || [], true) / 10
  );

  const pumpkinGardenScore = Math.floor(
    getHabitProgressForLifeAspect(habits, pumpkinsLifeAspect || [], true) / 10
  );

  console.log(houseLifeAspect && hasActiveBoosts(houseLifeAspect));

  const config: GardenConfig = {
    house: {
      score: houseScore,
      onClick: () => onAssetClick("home"),
      withBoosts: !!houseLifeAspect && hasActiveBoosts(houseLifeAspect),
    },
    tree: {
      score: treeScore,
      onClick: () => onAssetClick(treeLifeAspect?._id),
      withBoosts: !!treeLifeAspect && hasActiveBoosts(treeLifeAspect),
    },
    shed: {
      score: shedScore,
      onClick: () => onAssetClick(shedLifeAspect?._id),
      withBoosts: !!shedLifeAspect && hasActiveBoosts(shedLifeAspect),
    },
    animals: {
      score: animalsScore,
      onClick: () => onAssetClick(animalsLifeAspect?._id),
      withBoosts: !!animalsLifeAspect && hasActiveBoosts(animalsLifeAspect),
    },
    river: {
      score: riverScore,
      onClick: () => onAssetClick(riverLifeAspect?._id),
      withBoosts: !!riverLifeAspect && hasActiveBoosts(riverLifeAspect),
    },
    mountains: {
      score: mountainsScore,
      onClick: () => onAssetClick(mountainsLifeAspect?._id),
      withBoosts: !!mountainsLifeAspect && hasActiveBoosts(mountainsLifeAspect),
    },
    pumpkinGarden: {
      score: pumpkinGardenScore,
      onClick: () => onAssetClick(pumpkinsLifeAspect?._id),
      withBoosts: !!pumpkinsLifeAspect && hasActiveBoosts(pumpkinsLifeAspect),
    },
    defaultScore: { score, onClick: () => {}, withBoosts: false },
  };

  const handleUp = () => {
    setScore((prev) => Math.min(prev + 10, 100));
  };
  const handleDown = () => {
    setScore((prev) => Math.max(prev - 10, 0));
  };

  return (
    <div className="relative">
      <div className="absolute ml-1">
        <Button onClick={handleDown} size="icon" className="h-4 w-4">
          <IconMinus size={12} />
        </Button>

        {score}
        <Button onClick={handleUp} size="icon" className="h-4 w-4">
          <IconPlus size={12} />
        </Button>
      </div>

      <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-full border bg-white">
        <Garden config={config} />
      </div>
    </div>
  );
};
