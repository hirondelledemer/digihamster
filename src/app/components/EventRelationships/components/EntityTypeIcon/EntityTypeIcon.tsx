import { FC } from "react";
import {
  Icon24Hours,
  IconCalendar,
  IconFeather,
  IconFolder,
  IconManFilled,
  IconMapPin,
  IconNote,
  IconProgress,
  IconProps,
} from "@tabler/icons-react";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

const ICONS: {
  [key in RelationshipEntityType]: FC<IconProps>;
} = {
  [RelationshipEntityType.Event]: IconCalendar,
  [RelationshipEntityType.Habit]: Icon24Hours,
  [RelationshipEntityType.Journal]: IconFeather,
  [RelationshipEntityType.Location]: IconMapPin,
  [RelationshipEntityType.Note]: IconNote,
  [RelationshipEntityType.Person]: IconManFilled,
  [RelationshipEntityType.Project]: IconFolder,
  [RelationshipEntityType.Task]: IconProgress,
};

export interface EntityTypeIconProps {
  type: RelationshipEntityType;
  size?: number;
  color?: string;
}

/** the one place that decides what an entity type looks like */
export const EntityTypeIcon: FC<EntityTypeIconProps> = ({
  type,
  size = 16,
  color,
}) => {
  const Icon = ICONS[type];

  return <Icon size={size} color={color} aria-label={type} />;
};
