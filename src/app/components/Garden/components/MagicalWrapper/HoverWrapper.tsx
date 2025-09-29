import React, { useState } from "react";
type HoverWrapperProps = {
  children: React.ReactNode;
};

export const HoverWrapper: React.FC<HoverWrapperProps> = ({ children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <svg
      style={{ overflow: "visible", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <defs>
        <filter id="magic-glow-hover">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="6"
            floodColor="gold"
            floodOpacity="0.9"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="10"
            floodColor="violet"
            floodOpacity="0.6"
          />
        </filter>
      </defs>

      <g filter={hovered ? "url(#magic-glow-hover)" : undefined}>{children}</g>
    </svg>
  );
};
