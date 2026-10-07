import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import {
  EntityRelationship,
  useAllRelationshipsForEntity,
} from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { EventActions } from "../EventActions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import MinimalNote from "../MinimalNote";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import ProjectCard from "../ProjectCard";
import { useTaskById } from "@/app/utils/hooks/use-tasks-new/selectors";
import TaskCard from "../TaskCard";
import {
  Icon24Hours,
  IconArrowForward,
  IconCalendar,
  IconFeather,
  IconFolder,
  IconManFilled,
  IconMapPin,
  IconNote,
  IconProgress,
} from "@tabler/icons-react";
import { CreateRelationshipsForm } from "./components/RelationshipForm";

type NavigatorItem = {
  id: number;
  type: RelationshipEntityType;
};
type RelationshipNavigatorValue = {
  entities: NavigatorItem[];
  setEntities: any;
  activeEntity: any;
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
  setEntities: () => {},
  activeEntity: null,
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
  // const [activeEntityIndex, setActiveEntityIndex] = useState(null);

  const setActiveEntity = ({ id, type }) => {
    const entityIndex = entities.findIndex(
      (e) => e.id === id && e.type === type
    );
    if (entityIndex !== -1) {
      setEntities((e) => e.slice(0, entityIndex));
    } else {
      setEntities((e) => [...e, { id, type }]);
    }
  };

  console.log("context", entities);

  return (
    <RelationshipNavigatorContext.Provider
      value={{
        entities,
        // setEntities,
        setActiveEntity,
        // setActiveEntity: setActive,
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
}

export const RelatedEvent: FC<RelatedEventProps> = ({ eventId: id }) => {
  const event = useEventById(id);

  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Event,
  });
  if (!event) {
    return null;
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

export const RelatedHabit: FC<{ id: number }> = ({ id }) => {
  const habit = useHabitById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });
  if (!habit) {
    return null;
  }
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

  if (!location) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1">
        <IconMapPin size={24} color={location.color} aria-label="location" />
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </div>
    );
  }

  return (
    <Card className="p-0 rounded-md">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-normal flex items-center gap-2">
          <IconMapPin size={16} color={location.color} aria-label="location" />
          <div style={{ color: location.color }}>{location.title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex">
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </CardContent>
    </Card>
  );
};

export const RelatedPerson: FC<{ id: number }> = ({ id }) => {
  const person = usePersonById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!person) {
    return null;
  }
  return (
    <div>
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex items-center justify-between">
            <div>{person.name}</div>
          </CardTitle>
        </CardHeader>
      </Card>
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
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

export const RelatedProject: FC<{ id: number }> = ({ id }) => {
  const project = useProjectById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!project) {
    return null;
  }

  return (
    <div>
      <ProjectCard project={project} />
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={Math.random()} relationship={r} />
        ))}
      </div>
    </div>
  );
};

export const RelatedTask: FC<{ id: number }> = ({ id }) => {
  const task = useTaskById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!task) {
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

//////////
export interface RelatedEntityProps {
  relationship: EntityRelationship;
  compact: boolean;
}
export const RelatedEntity: FC<RelatedEntityProps> = ({
  relationship,
  compact,
}) => {
  const { setActiveEntity } = useContext(RelationshipNavigatorContext);

  const selectEntity = (type: RelationshipEntityType) =>
    setActiveEntity({
      id: relationship.target_id,
      type,
    });

  const getComponent = () => {
    switch (relationship.target_type) {
      case RelationshipEntityType.Event:
        return compact ? (
          <div>E</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedEvent eventId={relationship.target_id} />
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Event)}
            />
          </div>
        );
      case RelationshipEntityType.Habit:
        return compact ? (
          <div>H</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedHabit id={relationship.target_id} />{" "}
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Habit)}
            />
          </div>
        );
      case RelationshipEntityType.Journal:
        return compact ? (
          <div>J</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedJournal id={relationship.target_id} />
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Journal)}
            />
          </div>
        );
      case RelationshipEntityType.Location:
        return compact ? (
          <RelatedLocation id={relationship.target_id} compact={compact} />
        ) : (
          <div className="w-full flex gap-2 items-center">
            <div className="grow">
              <RelatedLocation id={relationship.target_id} compact={compact} />
            </div>
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Location)}
            />
          </div>
        );
      case RelationshipEntityType.Note:
        return compact ? (
          <div>N</div>
        ) : (
          <div className="flex gap-2 items-center">
            <div>note</div>
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Note)}
            />
          </div>
        );
      case compact ? <div>P</div> : RelationshipEntityType.Person:
        return (
          <div className="flex gap-2 items-center">
            <RelatedPerson id={relationship.target_id} />
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Person)}
            />
          </div>
        );
      case RelationshipEntityType.Project:
        return compact ? (
          <div>PP</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedProject id={relationship.target_id} />
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Project)}
            />
          </div>
        );
      case RelationshipEntityType.Task:
        return compact ? (
          <div>T</div>
        ) : (
          <div className="flex gap-2 items-center">
            <RelatedTask id={relationship.target_id} />
            <IconArrowForward
              onClick={() => selectEntity(RelationshipEntityType.Task)}
            />
          </div>
        );
      default:
        return <div>error</div>;
    }
  };

  return getComponent();
};

export interface RelatedEntityIconProps {
  relationship: EntityRelationship;
}
export const RelatedEntityIcon: FC<RelatedEntityIconProps> = ({
  relationship,
}) => {
  const { setActiveEntity } = useContext(RelationshipNavigatorContext);

  const selectEntity = (type: RelationshipEntityType) =>
    setActiveEntity({
      id: relationship.target_id,
      type,
    });

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
    <div className="w-full flex flex-col">
      {relationships.map((r) => (
        <RelatedEntity key={Math.random()} relationship={r} compact={compact} />
      ))}
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
    <div className="flex gap-2">
      {entities.map((e, idx) => (
        <EntityWithRelationships
          key={Math.random()}
          entityId={e.id}
          entityType={e.type}
          compact={idx !== entities.length - 1}
        />
      ))}
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
  // const relationships = useAllRelationshipsForEntity({
  //   entityId,
  //   entityType,
  // });

  console.log("navigator", entityId, entityType);

  return (
    <>
      <RelationshipNavigatorContextProvider
        key={Math.random()}
        initialItem={{ id: entityId, type: entityType }}
      >
        <RelationshipPanel />
      </RelationshipNavigatorContextProvider>
      <CreateRelationshipsForm entityId={entityId} entityType={entityType} />
    </>
  );
};
