import React, { useEffect, useRef, useState } from "react";

type MagicalWrapperProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
  disabled?: boolean;
  sparkleCount?: number;
};

const sparkleColors = ["white", "gold", "violet", "deepskyblue", "hotpink"];

export const MagicalWrapper: React.FC<MagicalWrapperProps> = ({
  children,
  sparkleCount = 30,
  disabled,
}) => {
  const groupRef = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState<{
    cx: number;
    cy: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (groupRef.current) {
      const box = groupRef.current.getBBox();
      setBbox({
        cx: box.x + box.width / 2,
        cy: box.y + box.height / 2,
        width: box.width,
        height: box.height,
      });
    }
  }, [children]);

  if (disabled) {
    return children;
  }

  return (
    <svg style={{ overflow: "visible" }}>
      <defs>
        <filter id="magic-glow-extra">
          {/* Strong gold glow */}
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="8"
            floodColor="gold"
            floodOpacity="0.9"
          />
          {/* Violet aura */}
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="16"
            floodColor="violet"
            floodOpacity="0.6"
          />
          {/* Cyan shimmer */}
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="24"
            floodColor="deepskyblue"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      {/* {bbox && ( */}
      <g filter="url(#magic-glow-extra)" ref={groupRef}>
        {/* Centralized breathing effect (around element center) */}
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.98;1.02;1"
          dur="5s"
          repeatCount="indefinite"
          additive="sum"
        />
        {children}
      </g>
      {/* )} */}

      {/* Floating colorful sparkles */}
      {bbox &&
        Array.from({ length: sparkleCount }).map((_, i) => {
          const randX = bbox.cx + (Math.random() - 0.5) * (bbox.width + 60); // spread wider than element
          const randY = bbox.cy + (Math.random() - 0.5) * (bbox.height + 60);
          const randR = Math.random() * 6 + 1;
          const floatX = (Math.random() - 0.5) * 8; // left-right drift
          const floatY = Math.random() * 8 + 4; // vertical float
          const floatDur = Math.random() * 5 + 4; // 4–9s
          const twinkleDur = Math.random() * 3 + 2;
          const color =
            sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

          return (
            <circle
              key={i}
              cx={randX}
              cy={randY}
              r={randR}
              fill={color}
              opacity="0.7"
            >
              {/* Twinkle */}
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${twinkleDur}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
              {/* Float drift (up-down + sideways) */}
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0; ${floatX} -${floatY}; 0 0`}
                dur={`${floatDur}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
            </circle>
          );
        })}
    </svg>
  );
};
