import { getRichTextEditorTestkit } from '../RichTextEditor/RichTextEditor.testkit';

export const getMinimalNoteTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTextarea: () => {
    return getRichTextEditorTestkit(component);
  },
});
