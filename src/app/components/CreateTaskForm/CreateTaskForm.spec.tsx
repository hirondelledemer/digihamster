import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import CreateTaskForm, {
  CreateTaskFormProps,
  rteTestId,
} from "./CreateTaskForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import mockAxios from "jest-mock-axios";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";

jest.mock("../../utils/date/date");

describe("CreateTaskForm", () => {
  const defaultProps: CreateTaskFormProps = {
    onDone: jest.fn(),
  };

  beforeEach(() => {
    mockAxios.patch.mockResolvedValueOnce({ data: {} });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(wrapWithTasksProvider(<CreateTaskForm {...props} />));

  it("should render CreateTaskForm", () => {
    renderComponent();

    expect(screen.getByTestId(rteTestId)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("should create basic task", async () => {
    renderComponent();
    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue("<p>test</p><p>note</p>");
    rteWrapper.blur();
    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
        description: `test\n\nnote`,
        descriptionFull: {
          content: [
            {
              content: [
                {
                  text: "test",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              content: [
                {
                  text: "note",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
        isActive: false,
        projectId: null,
        subtasks: [],
        tags: [],
        title: "test",
      });
    });
  });

  it("should create task with all the fields", async () => {
    renderComponent();
    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue(
      '<p>feed the cat</p><p><span data-type="projectMention" class="rte-hook_project__UsSIv" data-id="679cbfd01c93c55e18e183dd:#3b82f6" data-label="perfect cat">/p perfect cat</span> </p><p></p><p><span data-type="mention" class="rte-hook_tag__Ghi7L" data-id="678a222ffc21119042d789b7:#364FC7" data-label="task">@task</span> get the water</p><p><span data-type="mention" class="rte-hook_tag__Ghi7L" data-id="678a222ffc21119042d789b7:#364FC7" data-label="task">@task</span> get the food</p><p></p><p>cat has to be fed!!!!!!</p><p></p><p><span data-type="paramsMention" class="rte-hook_project__UsSIv" data-id="active" data-label="active">$active</span> </p><p><span data-type="mention" class="rte-hook_tag__Ghi7L" data-id="65c6a43d38a23c2c6627d07c:#FF6B6B" data-label="mmm">@mmm</span> </p>'
    );
    rteWrapper.blur();
    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
        description:
          "feed the cat\n\n/p perfect cat\n\n\n\n@task get the water\n\n@task get the food\n\n\n\ncat has to be fed!!!!!!\n\n\n\n$active\n\n@mmm",
        descriptionFull: {
          content: [
            {
              content: [
                {
                  text: "feed the cat",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              content: [
                {
                  attrs: {
                    id: "679cbfd01c93c55e18e183dd:#3b82f6",
                    label: "perfect cat",
                  },
                  type: "projectMention",
                },
              ],
              type: "paragraph",
            },
            {
              type: "paragraph",
            },
            {
              content: [
                {
                  attrs: {
                    id: "678a222ffc21119042d789b7:#364FC7",
                    label: "task",
                  },
                  type: "mention",
                },
                {
                  text: " get the water",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              content: [
                {
                  attrs: {
                    id: "678a222ffc21119042d789b7:#364FC7",
                    label: "task",
                  },
                  type: "mention",
                },
                {
                  text: " get the food",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              type: "paragraph",
            },
            {
              content: [
                {
                  text: "cat has to be fed!!!!!!",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              type: "paragraph",
            },
            {
              content: [
                {
                  attrs: {
                    id: "active",
                    label: "active",
                  },
                  type: "paramsMention",
                },
              ],
              type: "paragraph",
            },
            {
              content: [
                {
                  attrs: {
                    id: "65c6a43d38a23c2c6627d07c:#FF6B6B",
                    label: "mmm",
                  },
                  type: "mention",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
        isActive: true,
        projectId: "679cbfd01c93c55e18e183dd",
        subtasks: ["get the water", "get the food"],
        tags: ["65c6a43d38a23c2c6627d07c"],
        title: "feed the cat",
        deadline: undefined,
      });
    });
  });

  describe("deadlines", () => {
    it("should create task with todays deadline", async () => {
      renderComponent();
      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue(
        '<p>new task</p><p><span data-type="paramsMention" class="rte-hook_param__6mOZb" data-id="today" data-label="today">$today</span> </p>'
      );
      rteWrapper.blur();
      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          deadline: 7200000,
          description: "new task\n\n$today",
          descriptionFull: {
            content: [
              {
                content: [
                  {
                    text: "new task",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
              {
                content: [
                  {
                    attrs: {
                      id: "today",
                      label: "today",
                    },
                    type: "paramsMention",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          isActive: false,
          projectId: null,
          subtasks: [],
          tags: [],
          title: "new task",
        });
      });
    });

    it("should create task with tomorrows deadline", async () => {
      renderComponent();
      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue(
        '<p>new task</p><p><span data-type="paramsMention" class="rte-hook_param__6mOZb" data-id="tmr" data-label="tmr">$tmr</span> </p>'
      );
      rteWrapper.blur();
      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          deadline: 86400000,
          description: "new task\n\n$tmr",
          descriptionFull: {
            content: [
              {
                content: [
                  {
                    text: "new task",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
              {
                content: [
                  {
                    attrs: {
                      id: "tmr",
                      label: "tmr",
                    },
                    type: "paramsMention",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          isActive: false,
          projectId: null,
          subtasks: [],
          tags: [],
          title: "new task",
        });
      });
    });
  });

  describe("validation", () => {
    it("should require title", async () => {
      renderComponent();
      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue("<p></p><p>note</p>");
      rteWrapper.blur();
      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText("title: required")).toBeInTheDocument();
      });
      expect(mockAxios.post).not.toHaveBeenCalled();
    });
  });
});
