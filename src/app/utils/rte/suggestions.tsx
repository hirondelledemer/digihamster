import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance, Props } from "tippy.js";

import { ComponentType } from "react";

interface MentionsConfigProps {
  // TODO: extract and extend in the components
  command: any;
  query: string;
}

export const getMentionsConfig = (
  Component: ComponentType<MentionsConfigProps>
) => ({
  render: () => {
    let reactRenderer: ReactRenderer;
    let popup: Instance<Props>[];

    return {
      onStart: (props: any) => {
        reactRenderer = new ReactRenderer(Component, {
          props: {
            ...props,
          },
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return (reactRenderer.ref as any).onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
});
