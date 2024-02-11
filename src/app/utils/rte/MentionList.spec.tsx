import { MentionList, MentionListProps } from "./MentionList";
import { getMentionListTestkit } from "./MentionList.testkit";
import React from "react";
import { act, render, waitFor } from "@/config/utils/test-utils";
import MockAxios from "jest-mock-axios";
import { COLORS_V2 } from "../consts/colors";

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
  };
  const renderComponent = (props = defaultProps) =>
    getMentionListTestkit(render(<MentionList {...props} />).container);

  it("should render MentionList", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("should show tags", async () => {
    MockAxios.get.mockResolvedValueOnce({
      data: [
        { _id: "tag1", title: "Tag 1", color: COLORS_V2[0] },
        { _id: "tag2", title: "Tag 2", color: COLORS_V2[2] },
      ],
    });

    const wrapper = renderComponent();

    await waitFor(() => {
      expect(wrapper.getComponent().textContent).toBe("Tag 1Tag 2");
    });
  });

  describe("selecting tag", () => {
    it("should select tag", async () => {
      const tags = [
        { _id: "tag1", title: "Tag 1", color: COLORS_V2[0] },
        { _id: "tag2", title: "Tag 2", color: COLORS_V2[1] },
        { _id: "tag3", title: "Tag 3", color: COLORS_V2[2] },
      ];

      MockAxios.get.mockResolvedValueOnce({
        data: tags,
      });

      const ref = React.createRef();
      const command = jest.fn();
      const wrapper = renderComponent({
        ...defaultProps,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(wrapper.getComponent().textContent).toContain("Tag 1Tag 2");
      });

      act(() => {
        (ref.current as any).onKeyDown({
          event: { key: "ArrowDown" },
        });
      });
      (ref.current as any).onKeyDown({ event: { key: "Enter" } });

      expect(command).toHaveBeenCalledWith({
        id: `${tags[1]._id}:${tags[1].color}`,
        label: tags[1].title,
      });
    });

    it("should create new tag", async () => {
      const query = "new";
      const ref = React.createRef();
      const command = jest.fn();
      MockAxios.post.mockResolvedValueOnce({
        data: {
          _id: "newTag1",
          color: "#F06595",
          title: "new",
        },
      });

      const wrapper = renderComponent({
        ...defaultProps,
        query,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(wrapper.getCreateButton()).toBeInTheDocument();
      });

      act(() => {
        (ref.current as any).onKeyDown({ event: { key: "Enter" } });
      });

      await waitFor(() => {
        expect(MockAxios.post).toHaveBeenCalledWith("/api/tags", {
          color: "#ADB5BD",
          title: "new",
        });
        expect(command).toHaveBeenCalledWith({
          id: "newTag1:#F06595",
          label: "new",
        });
      });
    });
  });

  describe("filtering", () => {
    describe("tag exists by query", () => {
      const query = "Tag 1";
      it("should show tags filtered by query", async () => {
        const wrapper = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(wrapper.getComponent()).toHaveTextContent("Tag 1");
        });
      });
    });

    describe("tag does not exists by query", () => {
      const query = "new";
      it('should show show "create button"', async () => {
        const wrapper = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(wrapper.getCreateButton()).toBeInTheDocument();
        });
      });
    });
  });
});
