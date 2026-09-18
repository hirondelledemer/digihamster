import React, { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { IconBackspace, IconCheck, IconTrash } from "@tabler/icons-react";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import {
  getHabitLogDate,
  getHabitLogForADay,
} from "@/app/utils/habits/habit-log";
import { useRelatioshipBetweenEntities } from "@/app/utils/hooks/use-relationships/selectors";
import { IEvent } from "@/app/utils/types/event";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";

interface TaskActionProps {
  children: ReactNode;
  habit: IHabitWithLogs;
  event: IEvent;
}

export const HabitActions: React.FC<TaskActionProps> = ({
  children,
  habit,
  event,
}) => {
  const { addLog } = useHabitsNewActions();
  const { delete: deleteRelationship } = useRelationshipsActions();
  const relationshipId = useRelatioshipBetweenEntities({
    sourceId: event.id,
    sourceType: RelationshipEntityType.Event,
    targetId: habit.id,
    targetType: RelationshipEntityType.Habit,
  });

  const date = new Date(event.start_at);

  const log = getHabitLogForADay(habit, date);
  const isCompleted = log?.completed;

  const onCompleteClick = () => {
    addLog(habit.id, {
      completed: true,
      at: getHabitLogDate(date),
    });
  };

  const onUndoClick = () => {
    addLog(habit.id, {
      completed: false,
      at: getHabitLogDate(date),
    });
  };

  const onRemoveClick = () => {
    if (relationshipId) {
      deleteRelationship(relationshipId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {isCompleted && (
          <ContextMenuItem inset onClick={onUndoClick}>
            <IconBackspace />
            Undo
          </ContextMenuItem>
        )}
        {!isCompleted && (
          <ContextMenuItem inset onClick={onCompleteClick}>
            <IconCheck />
            Complete
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onRemoveClick} variant="destructive">
          <IconTrash />
          Remove from event
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
