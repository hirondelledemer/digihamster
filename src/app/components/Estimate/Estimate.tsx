import React, { FC } from "react";
import {
  IconCircle,
  IconComet,
  IconStar,
  IconStars,
} from "@tabler/icons-react";

export interface EstimateProps {
  estimate: number | null;
}

const Estimate: FC<EstimateProps> = ({ estimate }): JSX.Element => {
  if (!estimate) {
    return <IconCircle className="h-4 w-4" color="#eab308" />;
  }

  if (estimate < 1) {
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
