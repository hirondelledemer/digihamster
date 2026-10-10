import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useAllRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import {
  IRelationship,
  RelationshipEntityType,
} from "@/app/utils/types/relationship";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { EventActions } from "../EventActions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import MinimalNote from "../MinimalNote";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
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
  Icon24Hours,
  IconArrowForward,
  IconArrowRampRight2,
  IconCalendar,
  IconCheckbox,
  IconFeather,
  IconFolder,
  IconManFilled,
  IconMapPin,
  IconNote,
  IconProgress,
} from "@tabler/icons-react";
import { CreateRelationshipsForm } from "./components/RelationshipForm";
import { HabitCard } from "../HabitCard";
import { useHabitLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

const ALLOWED_TYPES: {
  [key: string]: RelationshipEntityType[]; // TODO: fix. also maybe extract
} = {
  [RelationshipEntityType.Location]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Event]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Person,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Location,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Person]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Note,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Event,
  ],
  [RelationshipEntityType.Project]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
  ],
  [RelationshipEntityType.Task]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
    RelationshipEntityType.Person,
    RelationshipEntityType.Location,
  ],
  [RelationshipEntityType.Journal]: [
    RelationshipEntityType.Person,
    RelationshipEntityType.Event,
  ],
};

type NavigatorItem = {
  id: number;
  type: RelationshipEntityType;
};
type RelationshipNavigatorValue = {
  entities: NavigatorItem[];
  setActiveEntity({
    id,
    type,
  }: {
    id: number;
    type: RelationshipEntityType;
  }): void;
};
const RelationshipNavigatorContext = createContext<RelationshipNavigatorValue>({
  entities: [] as NavigatorItem[],
  setActiveEntity: () => {},
});

export function RelationshipNavigatorContextProvider({
  initialItem,
  children,
}: {
  initialItem: { id: number; type: RelationshipEntityType };
  children: ReactNode;
}) {
  const [entities, setEntities] = useState<NavigatorItem[]>([initialItem]);

  const setActiveEntity = ({
    id,
    type,
  }: {
    id: number;
    type: RelationshipEntityType;
  }) => {
    const entityIndex = entities.findIndex(
      (e) => e.id === id && e.type === type
    );
    if (entityIndex !== -1) {
      setEntities((e) => e.slice(0, entityIndex));
    } else {
      setEntities((e) => [...e, { id, type }]);
    }
  };

  return (
    <RelationshipNavigatorContext.Provider
      value={{
        entities,
        setActiveEntity,
      }}
    >
      {children}
    </RelationshipNavigatorContext.Provider>
  );
}

//////////

//////////
export interface RelatedEventProps {
  eventId: number;
  compact: boolean;
}

export const RelatedEvent: FC<RelatedEventProps> = ({
  eventId: id,
  compact,
}) => {
  const event = useEventById(id);

  const relationships = useAllRelationshipsForEntity({
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
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </div>
    );
  }

  return (
    <>
      <EventActions event={event}>
        <Card className="p-0 rounded-md">
          <CardHeader className="p-4 pt-2">
            <CardTitle className="font-normal flex items-center justify-between">
              <div>{event.title}</div>
            </CardTitle>
          </CardHeader>
        </Card>
      </EventActions>
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </div>
    </>
  );
};

export const RelatedHabit: FC<{
  id: number;
  compact: boolean;
}> = ({ id, compact }) => {
  const habit = useHabitById(id);

  const icon = useHabitLifeAspectAssetIcon(habit);

  const { entities } = useContext(RelationshipNavigatorContext);

  const eventId = entities.findLast(
    (e) => e.type === RelationshipEntityType.Event
  )?.id;

  const event = useEventById(eventId);

  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!habit) {
    return null;
  }

  if (compact) {
    return icon;
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
            <RelatedEntityIcon key={Math.random()} relationship={r} />
          ))}
        </div>
      </>
    );
  }

  return <HabitCard habit={habit} event={event} />;
};

export const RelatedLocation: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const location = useLocationById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Location,
  });
  const { setActiveEntity } = useContext(RelationshipNavigatorContext);

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
          <RelatedEntityIcon
            key={Math.random()}
            relationship={r}
            allowedTypes={ALLOWED_TYPES[RelationshipEntityType.Location]}
          />
        ))}
      </div>
    );
  }

  return (
    // <div className="flex gap-2 items-center">
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="flex justify-between items-center">
            <div className="font-normal flex gap-2">
              <IconMapPin
                size={16}
                color={location.color}
                aria-label="location"
              />
              <div style={{ color: location.color }}>{location.title}</div>
            </div>
            <div>
              <Button variant="ghost" size="icon">
                <IconArrowRampRight2 onClick={selectEntity} size={16} />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <Trash
                  size={16}
                  onClick={() => {
                    console.log("deleting");
                  }}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {relationships.map((r) => (
            <RelatedEntity
              key={Math.random()}
              relationship={r}
              allowedTypes={ALLOWED_TYPES[RelationshipEntityType.Location]}
              compact={false}
            />
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
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Person,
  });

  const { setActiveEntity } = useContext(RelationshipNavigatorContext);

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Person,
    });

  if (!person) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{ border: `1px solid ${person.color}` }}
      >
        <IconManFilled
          size={24}
          color={person.color}
          aria-label={person.name}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <RelatedEntityIcon
            key={Math.random()}
            relationship={r}
            allowedTypes={ALLOWED_TYPES[RelationshipEntityType.Person]}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="w-[90%]">
        <Card className="p-0 rounded-md">
          <CardHeader className="p-4 pt-2">
            <CardTitle className="font-normal flex items-center gap-2">
              <IconManFilled
                size={16}
                color={person.color}
                aria-label="location"
              />
              <div style={{ color: person.color }}>{person.name}</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex">
            {relationships.map((r) => (
              <RelatedEntityIcon
                key={Math.random()}
                relationship={r}
                allowedTypes={ALLOWED_TYPES[RelationshipEntityType.Person]}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="w-[10%]">
        <IconArrowForward onClick={selectEntity} />
      </div>
    </div>
  );
};

export const RelatedJournal: FC<{ id: number }> = ({ id }) => {
  const journal = useJournalEntryById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!journal) {
    return null;
  }
  return (
    <div>
      <Card className="p-0 rounded-md">
        <MinimalNote note={journal.json_note} />
      </Card>
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </div>
    </div>
  );
};

// end leaf: shows tasks and habits
export const RelatedProject: FC<{ id: number }> = ({ id }) => {
  const project = useProjectById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  const task = useFirstTaskForTheProject(id);

  if (!project) {
    return null;
  }

  return (
    <div>
      <TaskCard task={task} />
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
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
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Task, // probably i should use here ALLOWED TYPES
  });
  const { main: color } = useTaskProjectColor(task);
  const { setActiveEntity, entities } = useContext(
    RelationshipNavigatorContext
  );

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
            : "none",
        }}
      >
        <IconCheckbox
          size={24}
          color={color}
          aria-label={task.title}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <RelatedEntityIcon
            key={Math.random()}
            relationship={r}
            allowedTypes={ALLOWED_TYPES[RelationshipEntityType.Task]}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Button variant="ghost" size="icon" className="absolute right-0">
        <IconArrowRampRight2
          onClick={selectEntity}
          size={16}
          color={!!relationships.length ? "green" : "red"}
        />
      </Button>
      <TaskCard task={task} />
    </div>
  );
};

//////////
export interface RelatedEntityProps {
  relationship: IRelationship;
  compact: boolean;
  allowedTypes: RelationshipEntityType[];
}
export const RelatedEntity: FC<RelatedEntityProps> = ({
  relationship,
  compact,
  allowedTypes = [],
}) => {
  if (!allowedTypes.includes(relationship.target_type)) {
    return null;
  }

  const getComponent = () => {
    switch (relationship.target_type) {
      case RelationshipEntityType.Task:
        return <RelatedTask id={relationship.target_id} compact={compact} />;
      case RelationshipEntityType.Event:
        return compact ? (
          <RelatedEvent eventId={relationship.target_id} compact />
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedEvent eventId={relationship.target_id} compact={false} />
            {/* <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Event)}
            /> */}
          </div>
        );
      case RelationshipEntityType.Habit:
        return <RelatedHabit id={relationship.target_id} compact={compact} />;
      case RelationshipEntityType.Journal:
        return compact ? (
          <div>J</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedJournal id={relationship.target_id} />
            {/* <IconArrowForward
              size={16}
              className="min-w-[30px]"
              onClick={() => selectEntity(RelationshipEntityType.Journal)}
            /> */}
          </div>
        );
      case RelationshipEntityType.Location:
        return (
          // <div className="flex gap-2 items-center">
          <RelatedLocation id={relationship.target_id} compact={compact} />
          // </div>
        );
      case RelationshipEntityType.Note:
        return compact ? (
          <div>N</div>
        ) : (
          <div className="flex gap-2 items-center">
            <div>note</div>
            {/* <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Note)}
            /> */}
          </div>
        );
      case RelationshipEntityType.Person:
        return (
          <div className="flex gap-2 items-center">
            <RelatedPerson id={relationship.target_id} compact={compact} />
          </div>
        );
      case RelationshipEntityType.Project:
        return compact ? (
          <div>PP</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedProject id={relationship.target_id} />
            {/* <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Project)}
            /> */}
          </div>
        );

      default:
        return <div>error</div>;
    }
  };

  return getComponent();
  // return (
  //   <div className="flex gap-2 items-center">
  //     <div className="w-[90%]">{getComponent()}</div>
  //     <div className="w-[10%]">
  //       <IconArrowForward
  //         onClick={() => selectEntity(relationship.target_type)}
  //       />
  //     </div>
  //   </div>
  // );
};

export interface RelatedEntityIconProps {
  relationship: IRelationship;
  allowedTypes?: RelationshipEntityType[];
}
export const RelatedEntityIcon: FC<RelatedEntityIconProps> = ({
  relationship,
  allowedTypes = [],
}) => {
  if (!allowedTypes.includes(relationship.target_type)) {
    return null;
  }

  switch (relationship.target_type) {
    case RelationshipEntityType.Event:
      return (
        <IconCalendar
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Event)}
        />
      );
    case RelationshipEntityType.Habit:
      return (
        <Icon24Hours
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Habit)}
        />
      );
    case RelationshipEntityType.Journal:
      return (
        <IconFeather
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Journal)}
        />
      );
    case RelationshipEntityType.Location:
      return (
        <IconMapPin
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Location)}
        />
      );
    case RelationshipEntityType.Note:
      return (
        <IconNote
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Note)}
        />
      );
    case RelationshipEntityType.Person:
      return (
        <IconManFilled
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Person)}
        />
      );
    case RelationshipEntityType.Project:
      return (
        <IconFolder
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Project)}
        />
      );
    case RelationshipEntityType.Task:
      return (
        <IconProgress
          size={16}
          // onClick={() => selectEntity(RelationshipEntityType.Task)}
        />
      );
    default:
      return <div>error</div>;
  }
};

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
  const relationships = useAllRelationshipsForEntity({
    entityId,
    entityType,
  });

  return (
    <div className="flex flex-col gap-2 items-center">
      {relationships.map((r) => (
        <RelatedEntity
          key={Math.random()}
          relationship={r}
          compact={compact}
          allowedTypes={ALLOWED_TYPES[entityType]}
        />
      ))}
      {!relationships.filter((r) =>
        (ALLOWED_TYPES[entityType] || []).includes(r.target_type)
      ).length && <div>no stuff here</div>}
    </div>
  );
};

export const RelationshipPanel: FC = () => {
  // const relationships = useAllRelationshipsForEntity({
  //   entityId,
  //   entityType,
  // });

  const { entities } = useContext(RelationshipNavigatorContext);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {entities.map((e, idx) => (
          <EntityWithRelationships
            key={Math.random()}
            entityId={e.id}
            entityType={e.type}
            compact={idx !== entities.length - 1}
          />
        ))}
        {!entities.length && <div>no relationships </div>}
      </div>
      <CreateRelationshipsForm
        entityId={entities[entities.length - 1].id}
        entityType={entities[entities.length - 1].type}
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
      key={Math.random()}
      initialItem={{ id: entityId, type: entityType }}
    >
      <RelationshipPanel />
    </RelationshipNavigatorContextProvider>
  );
};
