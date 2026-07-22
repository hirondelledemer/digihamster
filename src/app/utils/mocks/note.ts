import { INote } from "../types/note";
import { DEFAULT_TEST_DATE } from "./date";

export const generateNote: (
  i?: number,
  properties?: Partial<INote>,
) => INote = (i = 1, properties) => {
  return {
    id: i,
    title: `Note ${i}`,
    content: `note ${i}`,
    json_content: {
      content: [
        {
          content: [
            {
              text: `note ${i}`,
              type: "text",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "doc",
    },
    user_id: "",
    deleted: false,
    created_at: DEFAULT_TEST_DATE,
    ...properties,
  };
};

export const generateListOfNotes: (count: number) => INote[] = (count) => {
  return [...Array(count)].map((_v, i) => generateNote(i));
};

export const generateCustomNotesList: (
  noteInfo: Partial<INote>[],
) => INote[] = (noteInfo) => {
  return noteInfo.map((taskProperties, i) => ({
    ...generateNote(i, taskProperties),
  }));
};
