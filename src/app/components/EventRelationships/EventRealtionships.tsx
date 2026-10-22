import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import {
  IRelationship,
  RelationshipEntityType,
} from "@/app/utils/types/relationship";
import { FC, ReactNode, useContext } from "react";
import { EventActions } from "../EventActions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import MinimalNote from "../notes/MinimalNote";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import {
  useProjectById,
  useTaskProjectColor,
} from "@/app/utils/hooks/use-projects/selectors";
import {
  useFirstTaskForTheProject,
  useTaskById,
} from "@/app/utils/hooks/use-tasks-new/selectors";
import TaskCard from "../TaskCard";
import {
  IconArrowRampRight2,
  IconCalendar,
  IconCheckbox,
  IconFeather,
  IconManFilled,
  IconMapPin,
  IconNote,
} from "@tabler/icons-react";
import { CreateRelationshipsForm } from "./components/CreateRelationshipsForm/CreateRelationshipsForm";
import {
  NavigatorColumn,
  RelationshipNavigatorContext,
  useNavigator,
} from "./navigator-context";

export {
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
} from "./navigator-context";
import { NavigatorPath } from "./components/RelationshipNavigator/components/NavigatorPath/NavigatorPath";
import { EntityTypeIcon } from "./components/EntityTypeIcon";
import { HabitCard } from "../HabitCard";
import { useHabitLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";

//////////

//////////

// end leaf: shows tasks and habits

//////////

// export interface RelatedEntityIconProps {
//   relationship: IRelationship;
// }
// export const RelatedEntityIcon: FC<RelatedEntityIconProps> = ({
//   relationship,
// }) => <EntityTypeIcon type={relationship.target_type} size={16} />;

//////

// TODO: rename file
