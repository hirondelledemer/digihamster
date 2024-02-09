"use client";

// todo: make actual wrapper
import React from "react";
import { Views } from "react-big-calendar";
import Calendar from "../Calendar";

export const Temp = (): JSX.Element => {
  return (
    <div>
      <Calendar view={Views.AGENDA} />
    </div>
  );
};

export default Temp;
