import React from "react";

type HauntedWrapperProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
};

const ID = "haunted-filter";

export const HauntedWrapper: React.FC<HauntedWrapperProps> = ({ children }) => (
  <svg>
    <defs>
      {/* Ghostly distortion */}
      <filter id={ID}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="2"
          result="turb"
        >
          <animate
            attributeName="baseFrequency"
            dur="6s"
            values="0.02;0.05;0.02"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="12">
          <animate
            attributeName="scale"
            values="8;15;8"
            dur="3s"
            repeatCount="indefinite"
          />
        </feDisplacementMap>
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="4"
          floodColor="green"
          floodOpacity="0.7"
        />
      </filter>
    </defs>

    <g filter={`url(#${ID})`}>
      {/* Shaky haunted motion */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-2 -2; 2 2; -1 1; 0 0"
          dur="2s"
          repeatCount="indefinite"
        />
        {children}
      </g>

      {/* Floating mist particles */}
      <circle cx="50" cy="180" r="6" fill="rgba(100,255,100,0.2)">
        <animate
          attributeName="cy"
          values="180;20"
          dur="12s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.7;0.3"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="150" cy="200" r="8" fill="rgba(50,200,50,0.15)">
        <animate
          attributeName="cy"
          values="200;10"
          dur="15s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.2;0.6;0.2"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
);
