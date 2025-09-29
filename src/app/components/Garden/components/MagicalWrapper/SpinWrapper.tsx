import React, { useState, useRef, useEffect } from "react";

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
