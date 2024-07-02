import React, { FC } from "react";
import { IconComet, IconStar, IconStars } from "@tabler/icons-react";

export interface EstimateProps {
  estimate: number | null;
}

const Estimate: FC<EstimateProps> = ({ estimate }): JSX.Element => {
  if (!estimate) {
    return <IconComet size={18} color="green" />;
  }
  if (estimate > 0 && estimate < 4) {
    return (
      <div className="flex">
        {[...Array(estimate)].map((_v, i) => (
          <IconStar key={`icon-${i}`} size={10} className="text-gray-200" />
        ))}
      </div>
    );
  }
  return <IconStars size={18} className="text-gray-200" />;
};

export default Estimate;
