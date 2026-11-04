import { MentionList, MentionListProps } from "./MentionList";
import { getMentionListTestkit } from "./MentionList.testkit";
import React from "react";
import { act, render, waitFor } from "@/config/utils/test-utils";
import MockAxios from "jest-mock-axios";
import { Editor } from "@tiptap/react";
import { PeopleStateContext } from "../hooks/use-people/state-context";
import { generateListOfPeople } from "../mocks/person";

jest.mock("../common/random-int", () => ({
  getRandomInt: () => 0,
}));

describe("MentionList", () => {
  afterEach(() => {
    MockAxios.reset();
  });
  const defaultProps: MentionListProps = {
    command: jest.fn(),
    query: "",
    editor: {} as Editor,
    range: {
      from: 0,
      to: 1,
    },
    text: "",
    items: [],
    decorationNode: null,
  };

  const PEOPLE = generateListOfPeople(2);

  const renderComponent = (props = defaultProps) =>
    getMentionListTestkit(
      render(
        <PeopleStateContext.Provider value={{ data: PEOPLE, isLoading: false }}>
          <MentionList {...props} />
        </PeopleStateContext.Provider>
      ).container
    );

  it("should render MentionList", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });

  it("should show tags", async () => {
    const { getComponent } = renderComponent();

    await waitFor(() => {
      expect(getComponent().textContent).toBe("Person 0Person 1");
    });
  });

  describe("selecting tag", () => {
    it("should select tag", async () => {
      const ref = React.createRef();
      const command = jest.fn();
      const { getComponent } = renderComponent({
        ...defaultProps,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(getComponent().textContent).toContain("Person 0Person 1");
      });

      act(() => {
        (ref.current as any).onKeyDown({
          event: { key: "ArrowDown" },
        });
      });
      (ref.current as any).onKeyDown({ event: { key: "Enter" } });

      expect(command).toHaveBeenCalledWith({
        id: "1:person-color-1",
        label: "Person 1",
      });
    });

    it("should create new tag", async () => {
      const query = "new";
      const ref = React.createRef();
      const command = jest.fn();
      MockAxios.post.mockResolvedValueOnce({
        data: {
          id: "newTag1",
          color: "#F06595",
          title: "new",
        },
      });

      const { getCreateButton } = renderComponent({
        ...defaultProps,
        query,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(getCreateButton()).toBeInTheDocument();
      });

      act(() => {
        (ref.current as any).onKeyDown({ event: { key: "Enter" } });
      });

      await waitFor(() => {
        expect(MockAxios.post).toHaveBeenCalledWith("/people", {
          color: "#C92A2A",
          name: "new",
        });
      });
      expect(command).toHaveBeenCalledWith({
        id: "newTag1:#F06595",
        label: undefined, // TODO: look into it, i think this value is wrong
      });
    });
  });

  describe("filtering", () => {
    describe("tag exists by query", () => {
      const query = "Tag 1";
      it("should show tags filtered by query", async () => {
        const { getComponent } = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(getComponent()).toHaveTextContent("Tag 1");
        });
      });
    });

    describe("tag does not exists by query", () => {
      const query = "new";
      it('should show show "create button"', async () => {
        const { getCreateButton } = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(getCreateButton()).toBeInTheDocument();
        });
      });
    });
  });
});
