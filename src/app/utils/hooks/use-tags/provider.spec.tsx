import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useTagsState } from "./state-context";
import { TagsContextProvider } from "./provider";
import { useTagsActions } from "./actions-context";
import { generateListOfTags } from "../../mocks/tag";
import { CreateTagParams } from "./api";

describe("TagsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch tags and update the state", async () => {
    const mockData = generateListOfTags(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useTagsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((tag) => <div key={tag._id}>{tag.title}</div>)}
        </div>
      );
    };

    render(
      <TagsContextProvider>
        <TestComponent />
      </TagsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Tag 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useTagsState();
      return (
        <div>
          {isLoading ? (
            "Loading..."
          ) : (
            <div>Error: {errorMessage?.toString()}</div>
          )}
        </div>
      );
    };

    render(
      <TagsContextProvider>
        <TestComponent />
      </TagsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
  });

  it("should create a tag and update the state", async () => {
    const mockTag: CreateTagParams = {
      title: "new tag",
      color: "color1",
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useTagsState();
      const { create: createTag } = useTagsActions();
      return (
        <div>
          <button onClick={() => createTag(mockTag)}>Create Tag</button>
          <div>
            {data.map((tag) => (
              <div key={tag._id}>{tag.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TagsContextProvider>
          <TestComponent />
        </TagsContextProvider>
      </ToastProvider>
    );

    expect(screen.queryByText("new tag")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new tag")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith("/api/tags", mockTag);
  });
});
