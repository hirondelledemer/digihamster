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
import MinimalNote from "../MinimalNote";
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
import { CreateRelationshipsForm } from "./components/RelationshipForm";
import {
  NavigatorColumn,
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
  useNavigator,
} from "./navigator-context";

export {
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
} from "./navigator-context";
import { NavigatorPath } from "./NavigatorPath";
import { EntityTypeIcon } from "./entity-type-icon";
import { HabitCard } from "../HabitCard";
import { useHabitLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";

const RelatedEntityActions: FC<{
  entityId: number;
  entityType: RelationshipEntityType;
  children: ReactNode;
  relationshipId: number;
}> = ({ entityId, entityType, children, relationshipId }) => {
  const relationships = useRelevantRelationshipsForEntity({
    entityId,
    entityType,
  });

  const { setActiveEntity } = useNavigator();

  const { delete: remove } = useRelationshipsActions();

  const selectEntity = () =>
    setActiveEntity({
      id: entityId,
      type: entityType,
    });

  return (
    <div className="relative w-full">
      <div className="absolute right-0 z-10 flex flex-col">
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <IconArrowRampRight2
            onClick={selectEntity}
            size={12}
            color={!!relationships.length ? "#e11d48" : "grey"}
          />
        </Button>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Trash
            size={12}
            color="grey"
            onClick={() => {
              remove(relationshipId);
            }}
          />
        </Button>
      </div>
      <div className="w-[93%]">{children}</div>
    </div>
  );
};

//////////

//////////
export interface RelatedEventProps {
  id: number;
  compact: boolean;
}

export const RelatedEvent: FC<RelatedEventProps> = ({ id, compact }) => {
  const event = useEventById(id);

  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Event,
  });

  if (!event) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1">
        <IconCalendar size={24} aria-label="location" />
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    );
  }

  return (
    <EventActions event={event}>
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex items-center justify-between">
            <div>{event.title}</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </EventActions>
  );
};

export const RelatedHabit: FC<{
  id: number;
  compact: boolean;
}> = ({ id, compact }) => {
  const habit = useHabitById(id);

  const icon = useHabitLifeAspectAssetIcon(habit);

  const { entities, setActiveEntity } = useNavigator();

  const eventId = entities.findLast(
    (e) => e.type === RelationshipEntityType.Event
  )?.id;

  const event = useEventById(eventId);

  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

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
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
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
          {relationships.map((r) => (
            <RelatedEntityIcon key={r.id} relationship={r} />
          ))}
        </div>
      </>
    );
  }

  return <HabitCard habit={habit} event={event} />;
};

export const RelatedLocation: FC<{
  id: number;
  compact: boolean;
}> = ({ id, compact }) => {
  const location = useLocationById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Location,
  });
  const { setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Location,
    });

  if (!location) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1 w-[20px]">
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <IconMapPin
              size={24}
              color={location.color}
              aria-label="location"
              className="cursor"
              onClick={selectEntity}
            />
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {location.title}
          </TooltipContent>
        </Tooltip>
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="flex gap-2">
            <IconMapPin
              size={16}
              color={location.color}
              aria-label="location"
            />
            <div style={{ color: location.color }}>{location.title}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {relationships.map((r) => (
            <RelatedEntity key={r.id} relationship={r} compact={false} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export const RelatedPerson: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const person = usePersonById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Person,
  });

  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Person,
    });

  if (!person) {
    return null;
  }

  if (compact) {
    const relationshipNumber = 3; // todo: move to const
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Person
          )
            ? `1px solid ${person.color}`
            : "#fff",
        }}
      >
        <IconManFilled
          size={24}
          color={person.color}
          aria-label={person.name}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.slice(0, 3).map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
        {relationships.length - relationshipNumber}
      </div>
    );
  }

  return (
    <Card className="p-0 rounded-md w-full">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-normal flex gap-2">
          <IconManFilled size={16} color={person.color} aria-label="location" />
          <div style={{ color: person.color }}>{person.name}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-hidden">
          {relationships.slice(0, 5).map(
            (
              r // todo: maybe show somehow differently
            ) => (
              <RelatedEntityIcon key={r.id} relationship={r} />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const RelatedNote: FC<{ id: number }> = ({ id }) => {
  const note = useNoteById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Note,
  });

  if (!note) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex gap-2 items-center">
            <IconNote size={16} aria-label="note" />
            <div>{note.title}</div>
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="flex">
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    </div>
  );
};

export const RelatedJournal: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const journal = useJournalEntryById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Journal,
  });

  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Journal,
    });

  if (!journal) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Journal
          )
            ? `1px solid #fff`
            : "none",
        }}
      >
        <IconFeather
          size={24}
          color={"#fff"}
          aria-label={journal.title}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    );
  }
  return (
    <Card className="p-0 rounded-md">
      <MinimalNote note={journal.json_note} />
    </Card>
  );
};

// end leaf: shows tasks and habits
export const RelatedProject: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const project = useProjectById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Project,
  });

  const task = useFirstTaskForTheProject(id);

  const { entities, setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Project,
    });

  if (!project) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Project
          )
            ? `1px solid ${project.color}`
            : "#fff",
        }}
      >
        <IconCheckbox
          size={24}
          color={project.color || "#fff"}
          aria-label={project.title}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <TaskCard task={task} />
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    </div>
  );
};

export const RelatedTask: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const task = useTaskById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Task,
  });
  const { main: color } = useTaskProjectColor(task);
  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Task,
    });

  if (!task) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Task
          )
            ? `1px solid ${color}`
            : "#fff",
        }}
      >
        <IconCheckbox
          size={24}
          color={color || "#fff"}
          aria-label={task.title}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    );
  }

  return <TaskCard task={task} />;
};

//////////
export interface RelatedEntityProps {
  relationship: IRelationship;
  compact: boolean;
}
export const RelatedEntity: FC<RelatedEntityProps> = ({
  relationship,
  compact,
}) => {
  const getComponent = () => {
    const props = { id: relationship.target_id, compact };

    switch (relationship.target_type) {
      case RelationshipEntityType.Task:
        return <RelatedTask {...props} />;
      case RelationshipEntityType.Event:
        return <RelatedEvent {...props} />;
      case RelationshipEntityType.Habit:
        return <RelatedHabit {...props} />;
      case RelationshipEntityType.Journal:
        return <RelatedJournal {...props} />; // TODO: maybe extract these props
      case RelationshipEntityType.Location:
        return <RelatedLocation {...props} />;
      case RelationshipEntityType.Note:
        return <RelatedNote {...props} />;
      case RelationshipEntityType.Person:
        return <RelatedPerson {...props} />;
      case RelationshipEntityType.Project:
        return <RelatedProject {...props} />;
      default:
        return <div>error</div>;
    }
  };

  if (compact) {
    return getComponent();
  }

  return (
    <RelatedEntityActions
      entityId={relationship.target_id}
      entityType={relationship.target_type}
      relationshipId={relationship.id}
    >
      {getComponent()}
    </RelatedEntityActions>
  );
};

export interface RelatedEntityIconProps {
  relationship: IRelationship;
}
export const RelatedEntityIcon: FC<RelatedEntityIconProps> = ({
  relationship,
}) => <EntityTypeIcon type={relationship.target_type} size={16} />;

//////

// TODO: rename file
export interface RelationshipPanelProps {
  entityId: number;
  entityType: RelationshipEntityType;
  compact: boolean;
}
export const EntityWithRelationships: FC<RelationshipPanelProps> = ({
  entityId,
  entityType,
  compact,
}) => {
  const relationships = useRelevantRelationshipsForEntity({
    entityId,
    entityType,
  });

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {relationships.map((r) => (
        <RelatedEntity key={r.id} relationship={r} compact={compact} />
      ))}
      {!relationships.length && <div className="w-full">no stuff here</div>}
    </div>
  );
};

export const RelationshipPanel: FC = () => {
  // const relationships = useAllRelationshipsForEntity({
  //   entityId,
  //   entityType,
  // });

  const { entities } = useContext(RelationshipNavigatorContext);

  // the stack always holds at least the entity it was opened on
  const activeEntity = entities[entities.length - 1];

  if (!activeEntity) {
    return null;
  }

  return (
    <div>
      <NavigatorPath />
      <div className="mb-4 flex gap-2">
        {entities.map((e, idx) => {
          const isCurrent = idx === entities.length - 1;

          return (
            <NavigatorColumn key={`${e.type}-${e.id}`} index={idx}>
              <div
                // the levels you came through read as stacked rails rather
                // than loose icons, so it is obvious they are not part of the
                // panel
                className={
                  isCurrent ? "grow" : "shrink-0 rounded-md bg-muted/40 p-1"
                }
              >
                <EntityWithRelationships
                  entityId={e.id}
                  entityType={e.type}
                  compact={!isCurrent}
                />
              </div>
            </NavigatorColumn>
          );
        })}
      </div>
      <CreateRelationshipsForm
        entityId={activeEntity.id}
        entityType={activeEntity.type}
      />
    </div>
  );
};

// TODO: rename file
export interface RelationshipNavigatorProps {
  entityId: number;
  entityType: RelationshipEntityType;
}
export const RelationshipNavigator: FC<RelationshipNavigatorProps> = ({
  entityId,
  entityType,
}) => {
  return (
    <RelationshipNavigatorContextProvider
      key={`${entityType}-${entityId}`}
      initialItem={{ id: entityId, type: entityType }}
    >
      <RelationshipPanel />
    </RelationshipNavigatorContextProvider>
  );
};
