"use client";
import React, { useState } from "react";
import "./style.css";
import { Tree } from "./components/Tree/Tree";
import useHabits from "#src/app/utils/hooks/use-habits";
import { getHabitProgressForCategory } from "#src/app/utils/habits/getHabitProgress";
import { Button } from "../ui/button";
import { House } from "./components/House/House";
import { Background } from "./components/Background/Background";
import { Shed } from "./components/Shed/Shed";

export function Garden() {
  const [score, setScore] = useState(100);
  const { data: habits } = useHabits();

  const treeScore = getHabitProgressForCategory(habits, "health");
  const houseScore = getHabitProgressForCategory(habits, "home");

  const handleUp = () => {
    setScore((prev) => Math.min(prev + 10, 100));
  };
  const handleDown = () => {
    setScore((prev) => Math.max(prev - 10, 0));
  };

  return (
    <div>
      <Button onClick={handleDown} variant="ghost">
        down
      </Button>
      {score}
      <Button onClick={handleUp} variant="ghost">
        Up
      </Button>

      <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border bg-white">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sky */}
          <rect
            width="600"
            height="400"
            fill={score > 70 ? "#87CEEB" : score > 40 ? "#B0C4DE" : "#A9A9A9"}
          />

          {/* Sun/Moon */}
          <circle
            cx="500"
            cy="80"
            r="40"
            fill={score > 50 ? "#FFD700" : "#CCCCCC"}
            className={score > 50 ? "animate-spin-slow" : "opacity-50"}
          />

          <Background />
          <House stage={Math.floor(houseScore / 10)} />
          <Shed stage={Math.floor(score / 10)} />
          <Tree stage={Math.floor(treeScore / 10)} />

          {/* Fog */}
          {score < 30 && (
            <rect width="600" height="400" fill="white" opacity="0.1" />
          )}
        </svg>
      </div>
    </div>
  );
}
