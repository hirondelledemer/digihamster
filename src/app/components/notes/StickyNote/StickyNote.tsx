"use client";
import React, { ComponentProps, FC } from "react";

import { StickyNoteWrapper } from "../StickyNoteWrapper/StickyNoteWrapper";
import { MinimalNote } from "../MinimalNote";
import { cn } from "../../utils";
import { INote } from "@/app/utils/types/note";

export const StickyNote: FC<{
  note: INote;
  variant: ComponentProps<typeof StickyNoteWrapper>["variant"];
}> = ({ note, variant }): JSX.Element | null => {
  const variantIndex = note.id % 4;

  // Mix of messy hand-placed rotations
  const rotations = [
    "-rotate-1",
    "rotate-1",
    "rotate-[1.4deg]",
    "-rotate-[0.7deg]",
  ];
  const randomRotation = rotations[variantIndex];

  // Variations of organic, imperfectly cut note corners (top-left, top-right, bottom-right, bottom-left)
  const paperShapes = [
    "rounded-[4px_12px_4px_30px_/_12px_4px_30px_4px]", // Peeled bottom-left look
    "rounded-[16px_4px_45px_6px_/_4px_20px_6px_35px]", // Heavy bottom-right curl look
    "rounded-[6px_35px_8px_16px_/_25px_6px_20px_5px]", // Folded top-right look
    "rounded-[20px_8px_12px_8px_/_8px_30px_6px_25px]", // Slightly skewed all around
  ];
  const randomShape = paperShapes[variantIndex];

  const calculated = cn(
    // Base Structure & Interactive State
    "relative block max-w-64 h-auto min-h-[4.5rem] p-4 pl-5 text-xs font-mono leading-relaxed transform transition-all duration-200 focus-within:rotate-0 focus-within:scale-[1.02]",
    // Dark Mode Sticky Note Colors
    "bg-secondary bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-100 placeholder:text-amber-600/40 border border-zinc-700/40",
    // Shadow Layers
    "shadow-[5px_5px_14px_rgba(0,0,0,0.55),_0_8px_16px_rgba(0,0,0,0.35)] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none",
    // Embellishments (Notebook Lines, Margin Line, Left Binder Holes)
    "bg-[linear-gradient(to_bottom,transparent_96%,rgba(245,159,11,0.15)_96%)] bg-[size:100%_2rem]",
    "after:content-[''] after:absolute after:top-0 after:left-7 after:w-[1px] after:h-full after:bg-amber-500/30",
    "before:content-[''] before:absolute before:top-0 before:left-2 before:w-3 before:h-full before:bg-[radial-gradient(circle_4px_at_center,rgba(0,0,0,0.85)_95%,transparent_100%)] before:bg-[size:100%_1.5rem] before:opacity-70",
    // Inner block element positioning
    "[&_p]:pl-6 [&_p]:mb-0 [&_p]:leading-[1.5rem] [&_p]:min-h-[1.5rem]",

    // Dynamic Additions resolved safely via clsx / twMerge
    randomRotation,
    randomShape
  );

  return (
    <StickyNoteWrapper variant={variant}>
      <MinimalNote note={note.json_content} className={calculated} />
    </StickyNoteWrapper>
  );
};
