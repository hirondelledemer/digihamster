"use client";
import React, { useState } from "react";
import "./style.css";
import { Tree } from "./components/Tree/Tree";
import useHabits from "#src/app/utils/hooks/use-habits";
import { getHabitProgressForCategory } from "#src/app/utils/habits/getHabitProgress";
import { Button } from "../ui/button";

export function Garden() {
  const [score, setScore] = useState(100);
  const { data: habits } = useHabits();

  const treeScore = getHabitProgressForCategory(habits, "health");

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

          {/* Mountains */}
          <g>
            <polygon points="100,300 200,100 300,300" fill="#a0a0a0" />
            <polygon points="250,300 400,120 550,300" fill="#909090" />
          </g>

          {/* Trees */}
          <g className={score > 30 ? "trees-alive" : "trees-bare"}>
            <rect x="120" y="250" width="20" height="50" fill="#8B4513" />
            <circle cx="130" cy="240" r="25" fill="#228B22" />
            <rect x="180" y="260" width="20" height="40" fill="#8B4513" />
            <circle cx="190" cy="250" r="20" fill="#2E8B57" />
          </g>
          <Tree stage={Math.floor(treeScore / 10)} />

          {/* Flowers */}
          <g className={score > 50 ? "flower-bloom" : "flower-wilt"}>
            <circle cx="150" cy="350" r="5" fill="pink" />
            <circle cx="170" cy="350" r="5" fill="purple" />
            <circle cx="190" cy="350" r="6" fill="orange" />
          </g>

          {/* Fog */}
          {score < 30 && (
            <rect width="600" height="400" fill="white" opacity="0.1" />
          )}
        </svg>
      </div>
    </div>
  );
}
