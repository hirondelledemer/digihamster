"use client";
import React, { FC, useState } from "react";
import "./style.css";

import { getHabitProgressForLifeAspect } from "@/app/utils/habits/getHabitProgress";
import { Button } from "../ui/button";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Garden, GardenConfig } from "./Garden";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";

import { useHabitsNewState } from "@/app/utils/hooks/use-habits-new/state-context";

export const GardenContainer: FC<{
  onAssetClickAction: (category?: number) => void;
}> = ({ onAssetClickAction: onAssetClick }) => {
  const [score, setScore] = useState(100);
  const { data: habits } = useHabitsNewState();
  const { data: lifeAspects } = useLifeAspectsState();

  const treeLifeAspect = lifeAspects.find((la) => la.asset === "tree");
  const houseLifeAspect = lifeAspects.find((la) => la.asset === "house");
  const shedLifeAspect = lifeAspects.find((la) => la.asset === "shed");
  const animalsLifeAspect = lifeAspects.find((la) => la.asset === "animals");
  const riverLifeAspect = lifeAspects.find((la) => la.asset === "river");
  const mountainsLifeAspect = lifeAspects.find(
    (la) => la.asset === "mountains",
  );
  const pumpkinsLifeAspect = lifeAspects.find(
    (la) => la.asset === "pumpkinGarden",
  );

  const treeScore = Math.floor(
    getHabitProgressForLifeAspect(habits, treeLifeAspect || [], true) / 10,
  );
  const houseScore = Math.floor(
    getHabitProgressForLifeAspect(habits, houseLifeAspect || [], true) / 10,
  );
  const shedScore = Math.floor(
    getHabitProgressForLifeAspect(habits, shedLifeAspect || [], true) / 10,
  );

  console.log("shedScore", shedScore);
  const animalsScore = Math.floor(
    getHabitProgressForLifeAspect(habits, animalsLifeAspect || [], true) / 10,
  );
  const riverScore = Math.floor(
    getHabitProgressForLifeAspect(habits, riverLifeAspect || [], true) / 10,
  );

  const mountainsScore = Math.floor(
    getHabitProgressForLifeAspect(habits, mountainsLifeAspect || [], true) / 10,
  );

  const pumpkinGardenScore = Math.floor(
    getHabitProgressForLifeAspect(habits, pumpkinsLifeAspect || [], true) / 10,
  );

  const config: GardenConfig = {
    house: {
      score: houseScore,
      onClick: () => onAssetClick(houseLifeAspect?.id),
      withBoosts: !!houseLifeAspect && !!houseLifeAspect.boosts.length,
    },
    tree: {
      score: treeScore,
      onClick: () => onAssetClick(treeLifeAspect?.id),
      withBoosts: !!treeLifeAspect && !!treeLifeAspect.boosts.length,
    },
    shed: {
      score: shedScore,
      onClick: () => onAssetClick(shedLifeAspect?.id),
      withBoosts: !!shedLifeAspect && !!shedLifeAspect.boosts.length,
    },
    animals: {
      score: animalsScore,
      onClick: () => onAssetClick(animalsLifeAspect?.id),
      withBoosts: !!animalsLifeAspect && !!animalsLifeAspect.boosts.length,
    },
    river: {
      score: riverScore,
      onClick: () => onAssetClick(riverLifeAspect?.id),
      withBoosts: !!riverLifeAspect && !!riverLifeAspect.boosts.length,
    },
    mountains: {
      score: mountainsScore,
      onClick: () => onAssetClick(mountainsLifeAspect?.id),
      withBoosts: !!mountainsLifeAspect && !!mountainsLifeAspect.boosts.length,
    },
    pumpkinGarden: {
      score: pumpkinGardenScore,
      onClick: () => onAssetClick(pumpkinsLifeAspect?.id),
      withBoosts: !!pumpkinsLifeAspect && !!pumpkinsLifeAspect.boosts.length,
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
