import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useHabitLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelatedEntity } from "../RelatedEntity";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { HabitCard } from "@/app/components/HabitCard";
import { useEventScheduling } from "@/app/components/EventRelationships/use-event-scheduling";

export const RelatedHabit: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
  /** what was written during it - see VIEWS[Habit].asChild */
  related?: RelationshipNode[];
}> = ({ id, compact, summary = [], related = [] }) => {
  const habit = useHabitById(id);

  const icon = useHabitLifeAspectAssetIcon(habit);

  const { entities, setActiveEntity } = useNavigator();

  // which event the panel hangs off, and whether this habit is in it already,
  // is the same question the task cards ask
  const { eventId, scheduled, actions } = useEventScheduling(
    RelationshipEntityType.Habit,
    id
  );

  const event = useEventById(eventId);


  if (!habit) {
    return null;
  }

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Habit,
    });

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1 w-[20px]"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Habit
          )
            ? `1px solid #fff`
            : "",
        }}
      >
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <div onClick={selectEntity}>{icon}</div>
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {habit.title}
          </TooltipContent>
        </Tooltip>
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <Card className="p-0 rounded-md">
          <CardHeader className="p-4 pt-2">
            <CardTitle className="font-normal flex items-center justify-between">
              <div>{habit.title}</div>
            </CardTitle>
          </CardHeader>
        </Card>
        <div>
          {summary.map((type, i) => (
            <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <HabitCard
        habit={habit}
        event={event}
        scheduled={scheduled}
        additionalActions={actions}
      />
      {related.map((child) => (
        <RelatedEntity
          key={child.edge?.id ?? child.entity.id}
          node={child}
          compact={false}
        />
      ))}
    </>
  );
};
