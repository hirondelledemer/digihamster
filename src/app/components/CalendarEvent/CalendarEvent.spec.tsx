import { FC, ReactNode } from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@/config/utils/test-utils";
import CalendarEvent, { CalendarEventProps } from "./CalendarEvent";
import mockAxios from "jest-mock-axios";
import { generateEvent } from "@/app/utils/mocks/event";
import { generateTask } from "@/app/utils/mocks/task";
import { generateProject } from "@/app/utils/mocks/project";
import { generatePerson } from "@/app/utils/mocks/person";
import { generateLocation } from "@/app/utils/mocks/location";
import { generateNote } from "@/app/utils/mocks/note";
import { generateJournalEntry } from "@/app/utils/mocks/journal-entry";
import { generateCustomRelationshipsList } from "@/app/utils/mocks/relationship";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksContextProvider } from "@/app/utils/hooks/use-tasks/provider";
import { PeopleContextProvider } from "@/app/utils/hooks/use-people/provider";
import { LocationsContextProvider } from "@/app/utils/hooks/use-location/provider";
import { NotesContextProvider } from "@/app/utils/hooks/use-notes/provider";
import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import { RelationshipsContextProvider } from "@/app/utils/hooks/use-relationships/provider";
import { EVENTS_PATH, getEventsPath } from "@/app/utils/hooks/use-events/api";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks/api";
import { PEOPLE_PATH } from "@/app/utils/hooks/use-people/api";
import { LOCATIONS_PATH } from "@/app/utils/hooks/use-location/api";
import { NOTES_PATH } from "@/app/utils/hooks/use-notes/api";
import { JOURNAL_ENTRIES_PATH } from "@/app/utils/hooks/use-entry/api";
import { RELATIONSHIPS_PATH } from "@/app/utils/hooks/use-relationships/api";
import { EventStatus, IEvent } from "@/app/utils/types/event";
import { ProjectStatus } from "@/app/utils/types/project";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import {
  IRelationship,
  RelationshipEntityType,
} from "@/app/utils/types/relationship";
import { addHours } from "date-fns";
import { DndContext } from "@dnd-kit/core";
import { TooltipProvider } from "../ui/tooltip";

const routerPushSpy = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    replace: jest.fn(),
    push: routerPushSpy,
  }),
}));

const EVENT = generateEvent(1);
const PROJECT = generateProject(1, { status: ProjectStatus.Doing });
const TASK = generateTask(1, { status: TaskStatus.Doing });
const PERSON = generatePerson(1);
const LOCATION = generateLocation(1);
const NOTE = generateNote(1);
const JOURNAL = generateJournalEntry(1);

/** a relationship stored from the event towards the given entity */
const relatedTo = (target_type: RelationshipEntityType, target_id: number) => ({
  source_type: RelationshipEntityType.Event,
  source_id: EVENT.id,
  target_type,
  target_id,
});

const RELATIONSHIPS = generateCustomRelationshipsList([
  relatedTo(RelationshipEntityType.Task, TASK.id),
  relatedTo(RelationshipEntityType.Note, NOTE.id),
  relatedTo(RelationshipEntityType.Person, PERSON.id),
  relatedTo(RelationshipEntityType.Journal, JOURNAL.id),
  relatedTo(RelationshipEntityType.Location, LOCATION.id),
  relatedTo(RelationshipEntityType.Project, PROJECT.id),
]);

const PROVIDERS = [
  TooltipProvider,
  ProjectsContextProvider,
  TasksContextProvider,
  EventsContextProvider,
  PeopleContextProvider,
  LocationsContextProvider,
  NotesContextProvider,
  EntriesContextProvider,
  RelationshipsContextProvider,
] as FC<{ children: ReactNode }>[];

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    {PROVIDERS.reduceRight(
      (tree, Provider) => (
        <Provider>{tree}</Provider>
      ),
      children
    )}
  </>
);

interface Data {
  relationships?: IRelationship[];
  tasks?: ITask[];
  events?: IEvent[];
}

describe("CalendarEvent", () => {
  const defaultProps: CalendarEventProps = {
    event: {
      title: EVENT.title,
      start: new Date(DEFAULT_TEST_DATE),
      end: addHours(new Date(DEFAULT_TEST_DATE), 1),
      resource: {
        id: EVENT.id,
        type: "event",
        event: EVENT,
      },
    },
  };

  afterEach(() => {
    mockAxios.reset();
    routerPushSpy.mockReset();
  });

  /**
   * Everything the card draws now comes from the relationship graph, so each
   * entity the relationships point at has to be in its own provider.
   */
  const fixtures = ({
    relationships = RELATIONSHIPS,
    tasks = [TASK],
    events = [EVENT],
  }: Data) => [
    { url: PROJECTS_PATH, data: [PROJECT] },
    { url: TASKS_PATH, data: tasks },
    { url: EVENTS_PATH, data: events },
    { url: PEOPLE_PATH, data: [PERSON] },
    { url: LOCATIONS_PATH, data: [LOCATION] },
    { url: NOTES_PATH, data: [NOTE] },
    { url: JOURNAL_ENTRIES_PATH, data: [JOURNAL] },
    { url: RELATIONSHIPS_PATH, data: relationships },
  ];

  const renderComponent = async (props = defaultProps, state: Data = {}) => {
    render(
      <Providers>
        <DndContext>
          <CalendarEvent {...props} />
        </DndContext>
      </Providers>
    );

    const responses = fixtures(state);

    await waitFor(() =>
      expect(mockAxios.queue().length).toBeGreaterThanOrEqual(responses.length)
    );

    await act(async () => {
      responses.forEach(({ url, data }) =>
        mockAxios.mockResponseFor({ url }, { data })
      );
    });
  };

  const eventWithStatus = (status: EventStatus): CalendarEventProps => ({
    ...defaultProps,
    event: {
      ...defaultProps.event,
      resource: {
        ...defaultProps.event.resource,
        event: generateEvent(1, { status }),
      },
    },
  });

  const getMenuOptions = async () =>
    (await screen.findAllByRole("menuitem")).map(
      (option) => option.textContent
    );

  describe("content", () => {
    it("should show the event title and description", async () => {
      await renderComponent();

      expect(screen.getByText(EVENT.title)).toBeInTheDocument();
      expect(screen.getByText(EVENT.description)).toBeInTheDocument();
    });

    it("should show the start and end time", async () => {
      await renderComponent();

      expect(screen.getByText("10:10")).toBeInTheDocument();
      expect(screen.getByText("11:10")).toBeInTheDocument();
    });

    it("should open the event on click", async () => {
      await renderComponent();

      fireEvent.click(screen.getByText(EVENT.title));

      expect(routerPushSpy).toHaveBeenCalledWith(
        `/?eventId=${EVENT.id}`,
        undefined
      );
    });
  });

  describe("related entities", () => {
    it("should show a badge for every related entity", async () => {
      await renderComponent();

      expect(screen.getByLabelText(TASK.title)).toBeInTheDocument();
      expect(screen.getByLabelText(PERSON.name)).toBeInTheDocument();
      expect(screen.getByLabelText(JOURNAL.title)).toBeInTheDocument();
      expect(screen.getByLabelText("location")).toBeInTheDocument();
      // the note's title lives in a tooltip, so the badge is the icon
      expect(screen.getByLabelText("note")).toBeInTheDocument();
    });

    it("should show no badges when the event has no relationships", async () => {
      await renderComponent(defaultProps, { relationships: [] });

      expect(screen.queryByLabelText(TASK.title)).not.toBeInTheDocument();
      expect(screen.queryByLabelText("location")).not.toBeInTheDocument();
    });

    it("should not show a badge for a completed task", async () => {
      await renderComponent(defaultProps, {
        tasks: [generateTask(TASK.id, { status: TaskStatus.Done })],
      });

      expect(screen.queryByLabelText(TASK.title)).not.toBeInTheDocument();
    });

    // an event carries project_id, so an event-to-project row is not a
    // relationship at all - `canonicalEdge` has no entry for the pair and
    // `edgeTypeOf` resolves it to null. Rows like this are still in the
    // database until the backfill deletes them, so they have to stay
    // invisible rather than render as a stray badge.
    it("should not show a badge for a pair that is not a relationship", async () => {
      await renderComponent(defaultProps, {
        relationships: generateCustomRelationshipsList([
          relatedTo(RelationshipEntityType.Location, LOCATION.id),
          relatedTo(RelationshipEntityType.Project, PROJECT.id),
        ]),
      });

      expect(screen.getByLabelText("location")).toBeInTheDocument();
      expect(document.querySelector(".tabler-icon-folder")).toBeNull();
    });

    // this used to be the opposite assertion: ALLOWED_TYPES[Event] omitted
    // Event, so the badge row dropped it. VIEWS lists it on purpose now -
    // "moved to", "cancelled in favour of" - so the reversal is deliberate
    // and worth pinning rather than leaving to be rediscovered.
    it("should show a badge for another event it relates to", async () => {
      const OTHER_EVENT = generateEvent(2);

      await renderComponent(defaultProps, {
        events: [EVENT, OTHER_EVENT],
        relationships: generateCustomRelationshipsList([
          relatedTo(RelationshipEntityType.Event, OTHER_EVENT.id),
        ]),
      });

      expect(document.querySelector(".tabler-icon-calendar")).not.toBeNull();
    });
  });

  describe("context menu", () => {
    it("should show the options for a pending event", async () => {
      await renderComponent();

      fireEvent.contextMenu(screen.getByText(EVENT.title));

      expect(await getMenuOptions()).toStrictEqual([
        "Complete",
        "Move",
        "Cancel",
        "Edit",
        "Delete",
      ]);
    });

    it("should not show the complete option for a completed event", async () => {
      await renderComponent(eventWithStatus(EventStatus.Completed));

      fireEvent.contextMenu(screen.getByText(EVENT.title));

      expect(await getMenuOptions()).not.toContain("Complete");
    });

    it("should send a complete request", async () => {
      await renderComponent();

      fireEvent.contextMenu(screen.getByText(EVENT.title));
      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Complete" })
      );

      expect(mockAxios.patch).toHaveBeenCalledWith(getEventsPath(EVENT.id), {
        status: EventStatus.Completed,
      });
    });

    it("should send a delete request", async () => {
      await renderComponent();

      fireEvent.contextMenu(screen.getByText(EVENT.title));
      fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));

      expect(mockAxios.delete).toHaveBeenCalledWith(getEventsPath(EVENT.id));
    });
  });
});
