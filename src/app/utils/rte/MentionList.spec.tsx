import { MentionList, MentionListProps } from "./MentionList";
import React from "react";
import { act, render, waitFor, screen } from "@/config/utils/test-utils";
import MockAxios from "jest-mock-axios";
import { Editor } from "@tiptap/react";
import { generateListOfPeople } from "../mocks/person";
import { peopleState, providers } from "../tests/wrappers";

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
    render(
      <MentionList {...props} />,

      { wrapper: providers(peopleState({ data: PEOPLE })) }
    );

  it("should show tags", async () => {
    renderComponent();

    expect(screen.getByText(PEOPLE[0].name)).toBeInTheDocument();
    expect(screen.getByText(PEOPLE[1].name)).toBeInTheDocument();
  });

  describe("selecting tag", () => {
    it("should select tag", async () => {
      const ref = React.createRef();
      const command = jest.fn();

      renderComponent({
        ...defaultProps,
        ref,
        command,
      } as any);

      act(() => {
        (ref.current as any).onKeyDown({
          event: { key: "ArrowDown" },
        });
      });
      (ref.current as any).onKeyDown({ event: { key: "Enter" } });

      expect(command).toHaveBeenCalledWith({
        id: "1",
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

      renderComponent({
        ...defaultProps,
        query,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create/i })
        ).toBeInTheDocument();
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
        id: "newTag1",
        label: undefined, // TODO: look into it, i think this value is wrong
      });
    });
  });

  describe("filtering", () => {
    describe("tag exists by query", () => {
      const query = "Tag 1";
      it("should show tags filtered by query", async () => {
        renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(screen.getByText('Create"Tag 1"')).toBeInTheDocument();
        });
      });
    });

    describe("tag does not exists by query", () => {
      const query = "new";
      it('should show show "create button"', async () => {
        renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /create/i })
          ).toBeInTheDocument();
        });
      });
    });
  });
});
