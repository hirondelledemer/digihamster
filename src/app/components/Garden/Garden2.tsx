// LifeGarden.jsx
"use client";

import React, { useState, useEffect } from "react";
import "./style.css";

const initialCategories = {
  health: { score: 80, asset: "Tree" },
  selfCare: { score: 60, asset: "Mirror" },
  petCare: { score: 90, asset: "Cat" },
  learning: { score: 70, asset: "Book" },
  professional: { score: 50, asset: "Scaffold" },
  home: { score: 30, asset: "House" },
  relationships: { score: 85, asset: "Bench" },
  emotional: { score: 75, asset: "Flowers" },
};

const decayRate = 0.1; // percent per minute

export default function LifeGarden() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const interval = setInterval(() => {
      setCategories((prev: any) => {
        const updated: any = {};
        for (const key in prev) {
          updated[key] = {
            ...prev[key],
            score: Math.max(0, prev[key].score - decayRate),
          };
        }
        return updated;
      });
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const boostCategory = (key: any) => {
    setCategories((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        score: Math.min(100, prev[key].score + 10),
      },
    }));
  };

  return (
    <div className="garden-container">
      <svg viewBox="0 0 800 600" className="garden-svg">
        <Sun brightness={categories.health.score} />
        <Tree health={categories.health.score} />
        <Mirror clarity={categories.selfCare.score} />
        <Cat
          visible={categories.petCare.score > 30}
          happy={categories.petCare.score > 80}
        />
        <Book open={categories.learning.score > 50} />
        <Scaffold progress={categories.professional.score} />
        <House clean={categories.home.score > 60} />
        <Bench connected={categories.relationships.score > 60} />
        <Flowers blooming={categories.emotional.score > 50} />
      </svg>
      <div className="controls">
        {Object.keys(categories).map((key) => (
          <button key={key} onClick={() => boostCategory(key)}>
            + {key}
          </button>
        ))}
      </div>
    </div>
  );
}

// Placeholder Components
const Sun = ({ brightness }: any) => (
  <circle cx="700" cy="100" r="50" fill="gold" opacity={brightness / 100} />
);
const Tree = ({ health }: any) => (
  <circle cx="400" cy="300" r={50 + health / 4} fill="green" />
);
const Mirror = ({ clarity }: any) => (
  <rect
    x="100"
    y="400"
    width="50"
    height="80"
    fill="lightblue"
    opacity={clarity / 100}
  />
);
const Cat = ({ visible, happy }: any) =>
  visible ? <circle cx="200" cy="500" r={happy ? 20 : 10} fill="gray" /> : null;
const Book = ({ open }: any) => (
  <rect
    x="300"
    y="450"
    width="60"
    height="40"
    fill={open ? "brown" : "saddlebrown"}
  />
);
const Scaffold = ({ progress }: any) => (
  <rect x="500" y="350" width="20" height={progress} fill="silver" />
);
const House = ({ clean }: any) => (
  <rect
    x="600"
    y="400"
    width="60"
    height="60"
    fill={clean ? "white" : "gray"}
  />
);
const Bench = ({ connected }: any) => (
  <rect
    x="650"
    y="500"
    width="40"
    height="20"
    fill={connected ? "chocolate" : "dimgray"}
  />
);
const Flowers = ({ blooming }: any) =>
  blooming ? <circle cx="100" cy="100" r="10" fill="pink" /> : null;
