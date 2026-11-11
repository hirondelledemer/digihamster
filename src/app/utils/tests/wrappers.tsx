import { ComponentProps, ReactElement, ReactNode } from "react";
import {
  TasksActionsContext,
  TasksActionsContextValue,
} from "../hooks/use-tasks/actions-context";
import { EventsStateContext } from "../hooks/use-events/state-context";
import { RelationshipsActionsContext } from "../hooks/use-relationships/actions-context";

type Wrapper = (children: ReactNode) => ReactElement;

export const taskActions = (
  value: Partial<TasksActionsContextValue> = {}
): Wrapper =>
  function TaskActionsWrapper(children) {
    return (
      <TasksActionsContext.Provider
        value={{
          createTask: jest.fn(),
          updateTask: jest.fn(),
          deleteTask: jest.fn(),
          reorderTasksInTheProject: jest.fn(),
          reorderTasksInTheEvent: jest.fn(),
          ...value,
        }}
      >
        {children}
      </TasksActionsContext.Provider>
    );
  };

export const eventsState = (
  value: Partial<
    ComponentProps<typeof EventsStateContext.Provider>["value"]
  > = {}
): Wrapper =>
  function EventsStateWrapper(children) {
    return (
      <EventsStateContext.Provider
        value={{
          data: [],
          isLoading: false,
          ...value,
        }}
      >
        {children}
      </EventsStateContext.Provider>
    );
  };

export const relationshipsActions = (
  value: Partial<
    ComponentProps<typeof RelationshipsActionsContext.Provider>["value"]
  > = {}
): Wrapper =>
  function RelationshipsActionsWrapper(children) {
    return (
      <RelationshipsActionsContext.Provider
        value={{
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          ...value,
        }}
      >
        {children}
      </RelationshipsActionsContext.Provider>
    );
  };

/**
 * Combines wrappers into a single `wrapper` for RTL's `render`.
 * The first wrapper is the outermost one.
 */
export const providers =
  (...wrappers: Wrapper[]) =>
  ({ children }: { children: ReactNode }) =>
    wrappers.reduceRight<ReactElement>(
      (acc, wrap) => wrap(acc),
      <>{children}</>
    );
