import { act, waitFor, cleanup } from "@testing-library/react";

import JournalEntryForm, { JournalEntryFormProps } from "./JournalEntryForm";
import { getJournalEntryFormTestkit } from "./JournalEntryForm.testkit";
import { render } from "@/config/utils/test-utils";

// todo: fix this test.
describe.skip("JournalEntryForm", () => {
  const defaultProps: JournalEntryFormProps = {};
  const renderComponent = (props: JournalEntryFormProps = defaultProps) =>
    getJournalEntryFormTestkit(
      render(<JournalEntryForm {...props} />).container
    );

  afterEach(cleanup);

  it("should render JournalEntryForm", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("should show textbox and submit button", () => {
    const wrapper = renderComponent();
    expect(wrapper.getTextarea().getComponent()).toBeInTheDocument();
    expect(wrapper.getSubmitButton()).toBeInTheDocument();
  });

  it('should disable "Create" button until text is entered', async () => {
    const wrapper = renderComponent();
    expect(wrapper.getSubmitButton()).toBeDisabled();
    act(() => {
      wrapper.getTextarea().enterValue("note");
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
  });

  it("should submit entry", async () => {
    const newText = "<p>test</p><p>note</p>";
    const mutationSpy = jest.fn();
    // const mocks = [
    //   createJournalEntryMutationMock({
    //     variables: {
    //       note: newText,
    //       title: "test",
    //       tags: [],
    //     },
    //     callback: mutationSpy,
    //   }),
    // ];

    const wrapper = renderComponent(defaultProps);
    act(() => {
      wrapper.getTextarea().enterValue(newText);
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
    wrapper.clickButton();
    await waitFor(() => {
      expect(mutationSpy).toHaveBeenCalled();
    });
  });

  it("should submit entry, on Ctrl + Enter", async () => {
    const newText = "<p>test</p><p>note</p>";
    const mutationSpy = jest.fn();
    // const mocks = [
    //   createJournalEntryMutationMock({
    //     variables: {
    //       note: "<p>test</p><p>note<br></p>",
    //       title: "test",
    //       tags: [],
    //     },
    //     callback: mutationSpy,
    //   }),
    // ];

    const wrapper = renderComponent(defaultProps);
    act(() => {
      wrapper.getTextarea().enterValue(newText);
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
    wrapper.getTextarea().pressCtrlEnter();
    await waitFor(() => {
      expect(mutationSpy).toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    const props: JournalEntryFormProps = {
      ...defaultProps,
      editMode: true,
      initialValues: {
        id: "id",
        title: "title",
        note: "<p>title<br>note</p>",
      },
    };

    it("should show values", () => {
      const wrapper = renderComponent({
        ...props,
      });

      expect(wrapper.getTextarea().getComponent().textContent).toBe(
        "titlenote"
      );
    });

    it('should show "edit" and "delete" buttons', () => {
      const wrapper = renderComponent({
        ...props,
      });
      expect(wrapper.getSubmitButton()).not.toBeInTheDocument();
      expect(wrapper.getSaveButton()).toBeInTheDocument();
      expect(wrapper.getDeleteButton()).toBeInTheDocument();
    });

    it("should enable edit button only if initial value has changed", async () => {
      const wrapper = renderComponent({
        ...props,
      });

      expect(wrapper.getSaveButton()).toBeDisabled();
      act(() => {
        wrapper.getTextarea().enterValue("new text");
      });
      await waitFor(() => {
        expect(wrapper.getSaveButton()).not.toBeDisabled();
      });
    });

    it("should submit with id", async () => {
      const newValue = "<p>test</p><p>note</p>";
      const mutationSpy = jest.fn();
      // const mocks = [
      //   updateJournalEntryMutationMock({
      //     variables: {
      //       note: newValue,
      //       title: "test",
      //       id: props.initialValues.id,
      //       tags: [],
      //     },
      //     callback: mutationSpy,
      //   }),
      // ];

      const wrapper = renderComponent(props);
      act(() => {
        wrapper.getTextarea().enterValue(newValue);
      });
      await waitFor(() => {
        expect(wrapper.getSaveButton()).not.toBeDisabled();
      });
      wrapper.clickSaveButton();
      await waitFor(() => {
        expect(mutationSpy).toHaveBeenCalled();
      });
    });

    it("should delete entry", async () => {
      const newValue = "<p>test</p><p>note</p>";
      const mutationSpy = jest.fn();
      // const mocks = [
      //   deleteJournalEntryMutationMock({
      //     variables: {
      //       id: props.initialValues.id,
      //     },
      //     callback: mutationSpy,
      //   }),
      // ];

      const wrapper = renderComponent(props);
      act(() => {
        wrapper.getTextarea().enterValue(newValue);
      });
      wrapper.clickDeleteButton();
      await waitFor(() => {
        expect(mutationSpy).toHaveBeenCalled();
      });
    });
  });
});
