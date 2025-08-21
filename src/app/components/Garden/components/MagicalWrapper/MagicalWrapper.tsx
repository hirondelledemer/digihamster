import React, { useEffect, useRef, useState } from "react";

type HauntedWrapperProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
};

export const HauntedWrapper: React.FC<HauntedWrapperProps> = ({ children }) => {
  const id = "haunted-filter";

  return (
    <svg>
      <defs>
        {/* Ghostly distortion */}
        <filter id={id}>
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

      <g filter={`url(#${id})`}>
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
};

type MagicalWrapperProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
};

export const MagicalWrapper: React.FC<MagicalWrapperProps> = ({ children }) => {
  const groupRef = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (groupRef.current) {
      setBbox(groupRef.current.getBBox());
    }
  }, [children]);

  return (
    <svg style={{ overflow: "visible" }}>
      <defs>
        {/* Glow filter */}
        <filter id="magic-glow">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="6"
            floodColor="gold"
            floodOpacity="0.9"
          >
            <animate
              attributeName="stdDeviation"
              values="4;8;4"
              dur="3s"
              repeatCount="indefinite"
            />
          </feDropShadow>
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="10"
            floodColor="violet"
            floodOpacity="0.6"
          />
        </filter>
      </defs>

      <g filter="url(#magic-glow)" ref={groupRef}>
        {/* Pulsing scale animation */}
        <g>
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.05;1"
            dur="3s"
            repeatCount="indefinite"
            additive="sum"
          />
          {children}
        </g>
      </g>

      {bbox && (
        <>
          {/* Orbiting sparkle (white) */}
          <circle r="2" fill="white">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path={`M ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2}
                     m -${bbox.width / 1.5} 0
                     a ${bbox.width / 1.5} ${bbox.height / 1.5} 0 1 1 ${
                bbox.width * 1.2
              } 0
                     a ${bbox.width / 1.5} ${bbox.height / 1.5} 0 1 1 -${
                bbox.width * 1.2
              } 0`}
            />
          </circle>

          {/* Orbiting sparkle (aqua) */}
          <circle r="1.5" fill="aqua">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path={`M ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2}
                     m -${bbox.width / 2} 0
                     a ${bbox.width / 2} ${bbox.height / 2} 0 1 1 ${
                bbox.width
              } 0
                     a ${bbox.width / 2} ${bbox.height / 2} 0 1 1 -${
                bbox.width
              } 0`}
            />
          </circle>
        </>
      )}
    </svg>
  );
};

type HoverMagicalWrapperProps = {
  children: React.ReactNode;
};

export const HoverMagicalWrapper: React.FC<HoverMagicalWrapperProps> = ({
  children,
}) => {
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

type SpinWrapperProps = {
  children: React.ReactNode;
  duration?: number; // seconds for one full spin
  offset: {
    x: number;
    y: number;
  };
};

export const SpinWrapper: React.FC<SpinWrapperProps> = ({
  children,
  duration = 20,
  offset,
}) => {
  const groupRef = useRef<SVGGElement>(null);
  const [center, setCenter] = useState<{ cx: number; cy: number } | null>(null);

  useEffect(() => {
    if (groupRef.current) {
      const box = groupRef.current.getBBox();
      setCenter({
        cx: box.x + box.width / 2 + offset.x,
        cy: box.y + box.height / 2 + offset.y,
      });
    }
  }, [children, offset.x, offset.y]);

  return (
    <svg style={{ overflow: "visible" }}>
      <g ref={groupRef}>
        {center && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center.cx} ${center.cy}`}
            to={`360 ${center.cx} ${center.cy}`}
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        )}
        {children}
      </g>
    </svg>
  );
};
