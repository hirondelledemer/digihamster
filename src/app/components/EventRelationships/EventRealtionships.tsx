import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import {
  EntityRelationship,
  useAllRelationshipsForEntity,
} from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { createContext, FC, useState } from "react";
import { EventActions } from "../EventActions";
import { Card, CardHeader, CardTitle } from "../ui/card";
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
  IconCalendar,
  IconFeather,
  IconFolder,
  IconManFilled,
  IconMapPin,
  IconNote,
  IconProgress,
} from "@tabler/icons-react";
import { CreateRelationshipsForm } from "./components/RelationshipForm";

// TODO: in relat. selectors create that so both target and source relationships can be returned.
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
          <RelatedEntityIcon key={r.id} relationship={r} />
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
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    </>
  );
};

export const RelatedLocation: FC<{ id: number }> = ({ id }) => {
  const location = useLocationById(id);
  const relationships = useAllRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Habit,
  });

  if (!location) {
    return null;
  }

  return (
    <div>
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex items-center justify-between">
            <div>{location.title}</div>
          </CardTitle>
        </CardHeader>
      </Card>
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    </div>
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
          <RelatedEntityIcon key={r.id} relationship={r} />
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
          <RelatedEntityIcon key={r.id} relationship={r} />
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
      <ProjectCard project={project} />;
      <div>
        {relationships.map((r) => (
          <RelatedEntityIcon key={r.id} relationship={r} />
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
          <RelatedEntityIcon key={r.id} relationship={r} />
        ))}
      </div>
    </div>
  );
};

//////////
export interface RelatedEntityProps {
  relationship: EntityRelationship;
}
export const RelatedEntity: FC<RelatedEntityProps> = ({ relationship }) => {
  switch (relationship.target_type) {
    case RelationshipEntityType.Event:
      return <RelatedEvent eventId={relationship.target_id} />;
    case RelationshipEntityType.Habit:
      return <RelatedHabit id={relationship.target_id} />;
    case RelationshipEntityType.Journal:
      return <RelatedJournal id={relationship.target_id} />;
    case RelationshipEntityType.Location:
      return <RelatedLocation id={relationship.target_id} />;
    case RelationshipEntityType.Note:
      return <div>note</div>;
    case RelationshipEntityType.Person:
      return <RelatedPerson id={relationship.target_id} />;
    case RelationshipEntityType.Project:
      return <RelatedProject id={relationship.target_id} />;
    case RelationshipEntityType.Task:
      return <RelatedTask id={relationship.target_id} />;
    default:
      return <div>error</div>;
  }
};

export interface RelatedEntityIconProps {
  relationship: EntityRelationship;
}
export const RelatedEntityIcon: FC<RelatedEntityIconProps> = ({
  relationship,
}) => {
  switch (relationship.target_type) {
    case RelationshipEntityType.Event:
      return <IconCalendar />;
    case RelationshipEntityType.Habit:
      return <Icon24Hours />;
    case RelationshipEntityType.Journal:
      return <IconFeather />;
    case RelationshipEntityType.Location:
      return <IconMapPin />;
    case RelationshipEntityType.Note:
      return <IconNote />;
    case RelationshipEntityType.Person:
      return <IconManFilled />;
    case RelationshipEntityType.Project:
      return <IconFolder />;
    case RelationshipEntityType.Task:
      return <IconProgress />;
    default:
      return <div>error</div>;
  }
};

//////

// const RelationshipNavigatorContextProvider = createContext([]);

// export function RelationshipNavigatorContextProvider({ children }) {
//   const [entities, setEntitites] = useState("light");

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

//////////
// TODO: rename file
export interface RelationshipNavigatorProps {
  entityId: number;
  entityType: RelationshipEntityType;
}
export const RelationshipNavigator: FC<RelationshipNavigatorProps> = ({
  entityId,
  entityType,
}) => {
  const relationships = useAllRelationshipsForEntity({
    entityId,
    entityType,
  });

  return (
    <>
      {relationships.map((e) => (
        <RelatedEntity key={e.entity_id} relationship={e} />
      ))}
      <CreateRelationshipsForm
        entityId={entityId}
        entityType={RelationshipEntityType.Event}
      />
    </>
  );
};
