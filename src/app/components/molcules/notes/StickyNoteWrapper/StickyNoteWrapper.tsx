"use client";
import React, { FC, ReactNode } from "react";

import { StickyNoteVariant } from "@/app/utils/types/note";
import { cn } from "../../utils";

type StickyNoteWrapperProps = {
  children: ReactNode;
  variant: StickyNoteVariant;
};

export const StickyNoteWrapper: FC<StickyNoteWrapperProps> = ({
  children,
  variant,
}): JSX.Element | null => {
  return (
    <div
      className={cn(
        "relative inline-block pt-3 group",
        variant === "tape" && "mt-[-10px]"
      )}
    >
      {/* EMBELLISHMENT: Messy Torn-Edge Sticky Tape Overlay */}
      {variant === "tape" && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-6
                 bg-zinc-100/10 border border-zinc-100/15 backdrop-blur-[1.5px]
                 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transform -rotate-3 z-20 pointer-events-none"
        ></div>
      )}

      {/* EMBELLISHMENT: 3D Plastic Push-Pin */}
      {variant === "pin" && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-7 z-30 pointer-events-none drop-shadow-[2px_4px_3px_rgba(0,0,0,0.5)]">
          {/* Pin Head (Shiny Translucent Plastic) */}
          <div className="w-4 h-4 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-300 shadow-inner z-50"></div>

          {/* Pin Point / Metal Needle Shadow Cast */}
          <div className="w-[2px] h-3 mx-auto bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-[1px_2px_2px_rgba(0,0,0,0.4)]"></div>
        </div>
      )}
      {children}
    </div>
  );
};
