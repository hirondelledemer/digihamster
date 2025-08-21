"use client";
import React, { FC, useState } from "react";
import "./style.css";

import useHabits from "#src/app/utils/hooks/use-habits";
import { getHabitProgressForCategory } from "#src/app/utils/habits/getHabitProgress";
import { Button } from "../ui/button";

import { Category } from "../HabitForm/HabitForm.consts";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Garden, GardenConfig } from "./Garden";

export const GardenContainer: FC<{
  onAssetClickAction: (category: Category) => void;
}> = ({ onAssetClickAction: onAssetClick }) => {
  const [score, setScore] = useState(100);
  const { data: habits } = useHabits();

  const treeScore = Math.floor(
    getHabitProgressForCategory(habits, "health") / 10
  );
  const houseScore = Math.floor(
    getHabitProgressForCategory(habits, "home") / 10
  );
  const shedScore = Math.floor(
    getHabitProgressForCategory(habits, "profLearning") / 10
  );
  const animalsScore = Math.floor(
    getHabitProgressForCategory(habits, "relationships") / 10
  );
  const riverScore = Math.floor(
    getHabitProgressForCategory(habits, "selfCare") / 10
  );

  const mountainsScore = Math.floor(
    getHabitProgressForCategory(habits, "mental") / 10
  );

  const pumpkinGardenScore = Math.floor(
    getHabitProgressForCategory(habits, "learning") / 10
  );

  const config: GardenConfig = {
    house: { score: houseScore, onClick: () => onAssetClick("home") },
    tree: { score: treeScore, onClick: () => onAssetClick("health") },
    shed: { score: shedScore, onClick: () => onAssetClick("profLearning") },
    animals: {
      score: animalsScore,
      onClick: () => onAssetClick("relationships"),
    },
    river: { score: riverScore, onClick: () => onAssetClick("selfCare") },
    mountains: { score: mountainsScore, onClick: () => onAssetClick("mental") },
    pumpkinGarden: {
      score: pumpkinGardenScore,
      onClick: () => onAssetClick("learning"),
    },
    defaultScore: { score, onClick: () => {} },
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
