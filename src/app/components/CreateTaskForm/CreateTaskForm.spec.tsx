import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import CreateTaskForm, {
  CreateTaskFormProps,
  rteTestId,
} from "./CreateTaskForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import mockAxios from "jest-mock-axios";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";

jest.mock("../../utils/date/now");

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
    render(
      <TasksNewContextProvider>
        <CreateTaskForm {...props} />
      </TasksNewContextProvider>
    );

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
      expect(mockAxios.post).toHaveBeenCalledWith(TASKS_PATH, {
        deadline: null,
        description: "note",
        event_id: undefined,
        project_id: NaN,
        status: "todo",
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
      expect(mockAxios.post).toHaveBeenCalledWith(TASKS_PATH, {
        deadline: null,
        description: " get the water\n get the food\ncat has to be fed!!!!!!",
        event_id: undefined,
        project_id: NaN,
        status: "doing",
        title: "feed the cat",
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
        expect(mockAxios.post).toHaveBeenCalledWith(TASKS_PATH, {
          deadline: "1970-01-12T10:10:10.000Z",
          description: "",
          event_id: undefined,
          project_id: NaN,
          status: "todo",
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
        expect(mockAxios.post).toHaveBeenCalledWith(TASKS_PATH, {
          deadline: "1970-01-12T10:10:10.000Z",
          description: "",
          event_id: undefined,
          project_id: NaN, // TODO: fix these NaN
          status: "todo",
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
