import { renderHook, act } from "@/config/utils/test-utils";
import { useCompleteEvent } from "./event-completion";
import { generateEvent } from "../mocks/event";
import { RelationshipsStateContext } from "../hooks/use-relationships/state-context";
import { ReactNode } from "react";
import { IRelationship, RelationshipEntityType } from "../types/relationship";
import { TasksStateContext } from "../hooks/use-tasks/state-context";
import { ITask, TaskStatus } from "../types/task";
import { EventsActionsContext } from "../hooks/use-events/actions-context";
import { EventStatus } from "../types/event";
import { TasksActionsContext } from "../hooks/use-tasks/actions-context";
import { generateCustomRelationshipsList } from "../mocks/relationship";
import { generateCustomTasksList } from "../mocks/task";
import { NotesActionsContext } from "../hooks/use-notes/actions-context";
import { RelationshipsActionsContext } from "../hooks/use-relationships/actions-context";

describe("useCompleteEvent", () => {
  const EVENT = generateEvent();
  const NOTE_ID = 999;
  const updateEventMock = jest.fn().mockReturnValue(EVENT);
  const updateTaskMock = jest.fn();
  const createNoteMock = jest.fn().mockReturnValue({ id: NOTE_ID });
  const createRelationshipMock = jest.fn();

  const wrapper = ({
    relationships,
    tasks,
  }: {
    relationships: IRelationship[];
    tasks: ITask[];
  }) => {
    const LocationsState = ({ children }: { children: ReactNode }) => (
      <EventsActionsContext.Provider
        value={{
          create: jest.fn(),
          update: updateEventMock,
          delete: jest.fn(),
        }}
      >
        <RelationshipsStateContext.Provider
          value={{ data: relationships, isLoading: false }}
        >
          <TasksStateContext.Provider value={{ data: tasks, isLoading: false }}>
            <TasksActionsContext.Provider
              value={{
                createTask: jest.fn(),
                updateTask: updateTaskMock,
                deleteTask: jest.fn(),
                reorderTasksInTheProject: jest.fn(),
                reorderTasksInTheEvent: jest.fn(),
              }}
            >
              <NotesActionsContext.Provider
                value={{
                  create: createNoteMock,
                  update: jest.fn(),
                  delete: jest.fn(),
                }}
              >
                <RelationshipsActionsContext.Provider
                  value={{
                    create: createRelationshipMock,
                    update: jest.fn(),
                    delete: jest.fn(),
                  }}
                >
                  {children}
                </RelationshipsActionsContext.Provider>
              </NotesActionsContext.Provider>
            </TasksActionsContext.Provider>
          </TasksStateContext.Provider>
        </RelationshipsStateContext.Provider>
      </EventsActionsContext.Provider>
    );
    return LocationsState;
  };

  it("should complete event without any relationships", async () => {
    const { result } = renderHook(() => useCompleteEvent(EVENT), {
      wrapper: wrapper({ relationships: [], tasks: [] }),
    });

    const handleEventCompletion = result.current;

    await act(async () => {
      await handleEventCompletion();
    });

    expect(updateEventMock).toHaveBeenCalledWith(EVENT.id, {
      status: EventStatus.Completed,
    });
  });

  it("should move tasks to the active state and add the notes to them", async () => {
    const TASKS = generateCustomTasksList([
      { status: TaskStatus.Todo },
      { status: TaskStatus.Todo },
    ]);
    const RELATIONSHIPS = generateCustomRelationshipsList([
      {
        source_id: EVENT.id,
        source_type: RelationshipEntityType.Event,
        target_id: TASKS[0].id,
        target_type: RelationshipEntityType.Task,
      },
      {
        source_id: EVENT.id,
        source_type: RelationshipEntityType.Event,
        target_id: TASKS[1].id,
        target_type: RelationshipEntityType.Task,
      },
    ]);
    const { result } = renderHook(() => useCompleteEvent(EVENT), {
      wrapper: wrapper({ relationships: RELATIONSHIPS, tasks: TASKS }),
    });

    const handleEventCompletion = result.current;

    await act(async () => {
      await handleEventCompletion();
    });

    // updating the event to "Completed"
    expect(updateEventMock).toHaveBeenCalledWith(EVENT.id, {
      status: EventStatus.Completed,
    });

    // updating the tasks to "Doing"
    expect(updateTaskMock).toHaveBeenNthCalledWith(1, TASKS[0].id, {
      status: TaskStatus.Doing,
    });
    expect(updateTaskMock).toHaveBeenNthCalledWith(2, TASKS[1].id, {
      status: TaskStatus.Doing,
    });

    // creating the note
    expect(createNoteMock).toHaveBeenNthCalledWith(1, {
      content: "",
      json_content: {
        content: [
          {
            content: [
              {
                text: 'activated after "Event 1" (on Jan 11) was completed',
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "doc",
      },
      title: "",
    });

    expect(createNoteMock).toHaveBeenNthCalledWith(2, {
      content: "",
      json_content: {
        content: [
          {
            content: [
              {
                text: 'activated after "Event 1" (on Jan 11) was completed',
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "doc",
      },
      title: "",
    });

    // attach notes to the tasks
    expect(createRelationshipMock).toHaveBeenNthCalledWith(1, {
      source_id: TASKS[0].id,
      source_type: RelationshipEntityType.Task,
      target_id: NOTE_ID,
      target_type: RelationshipEntityType.Note,
    });
    expect(createRelationshipMock).toHaveBeenNthCalledWith(2, {
      source_id: TASKS[1].id,
      source_type: RelationshipEntityType.Task,
      target_id: NOTE_ID,
      target_type: RelationshipEntityType.Note,
    });
  });
});
