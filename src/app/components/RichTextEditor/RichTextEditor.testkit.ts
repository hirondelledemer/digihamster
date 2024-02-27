import { fireEvent, queryHelpers } from "@testing-library/react";

export const getRichTextEditorTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTextarea: () =>
    queryHelpers.queryByAttribute("contenteditable", component, "true"),
  enterValue: (value: string) => {
    const comp = queryHelpers.queryByAttribute(
      "contenteditable",
      component,
      "true"
    );
    if (!comp) {
      return Error("text editor does not exist");
    }

    (comp as any).editor.commands.setContent(value);
  },

  clearValue: () => {
    const comp = queryHelpers.queryByAttribute(
      "contenteditable",
      component,
      "true"
    );
    if (!comp) {
      return Error("text editor does not exist");
    }
    (comp as any).editor.commands.setContent("");
  },

  pressCtrlEnter: () => {
    const comp = queryHelpers.queryByAttribute(
      "contenteditable",
      component,
      "true"
    );
    if (!comp) {
      return Error("text editor does not exist");
    }
    fireEvent.keyDown(comp, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
      ctrlKey: true,
    });
  },
  blur: () => {
    const comp = queryHelpers.queryByAttribute(
      "contenteditable",
      component,
      "true"
    );
    if (!comp) {
      return Error("text editor does not exist");
    }
    fireEvent.blur(comp);
  },
});
