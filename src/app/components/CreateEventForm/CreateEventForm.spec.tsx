import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import {
  CreateEventForm,
  CreateEventFormProps,
  rteTestId,
} from "./CreateEventForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import mockAxios from "@/__mocks__/axios";
import { getTasksPath } from "@/app/utils/hooks/use-tasks-new/api";
import { EVENTS_PATH } from "@/app/utils/hooks/use-events/api";

describe("CreateEventForm", () => {
  const DEFAULT_PROPS = {
    startAt: "2025-01-01",
    endAt: "2025-01-01",
    onDone: jest.fn(),
  } as const satisfies CreateEventFormProps;

  beforeEach(() => {
    mockAxios.patch.mockResolvedValueOnce({ data: {} });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("should create a basic event", async () => {
    render(
      <EventsContextProvider>
        <TasksNewContextProvider>
          <CreateEventForm {...DEFAULT_PROPS} />
        </TasksNewContextProvider>
      </EventsContextProvider>,
    );

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue("<p>test</p><p>note</p>");
    rteWrapper.blur();
    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(EVENTS_PATH, {
        all_day: false,
        description: "note",
        end_at: "2025-01-01T00:00:00.000Z",
        project_id: undefined,
        start_at: "2025-01-01T00:00:00.000Z",
        title: "test",
      });
    });
  });

  it("should create an event with tasks", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { id: 3 } });

    render(
      <EventsContextProvider>
        <TasksNewContextProvider>
          <CreateEventForm {...DEFAULT_PROPS} />
        </TasksNewContextProvider>
      </EventsContextProvider>,
    );

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "feed the cat" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "projectMention",
              attrs: { id: "1:#3b82f6", label: "perfect cat" },
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "taskMention",
              attrs: { id: "2", label: "buy cat food" },
            },
          ],
        },
      ],
    });

    rteWrapper.blur();

    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(EVENTS_PATH, {
        all_day: false,
        description: "",
        end_at: "2025-01-01T00:00:00.000Z",
        project_id: 1,
        start_at: "2025-01-01T00:00:00.000Z",
        title: "feed the cat",
      });
    });

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledWith(getTasksPath(2), {
        event_id: 3,
      });
    });
  });
});
