"use client";
import React from "react";

import { HabitsContextProvider } from "@/app/utils/hooks/use-habits/provider";

import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";

import { HabitsTable } from "../components/habits/HabitsTable";

export default function HabitsPage() {
  return (
    <HabitsContextProvider>
      <LifeAspectsContextProvider>
        <HabitsTable />
      </LifeAspectsContextProvider>
    </HabitsContextProvider>
  );
}
