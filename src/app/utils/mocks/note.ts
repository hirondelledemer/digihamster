import { Note } from "@/models/note";

export const generateNote: (i?: number, properties?: Partial<Note>) => Note = (
  i = 1,
  properties
) => {
  return {
    _id: `note${i}`,
    title: `Note ${i}`,
    note: `note ${i}`,
    jsonNote: {
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
    isActive: false,
    deleted: false,
    userId: "",
    tags: [],
    updatedAt: "",
    ...properties,
  };
};

export const generateListOfNotes: (count: number) => Note[] = (count) => {
  return [...Array(count)].map((_v, i) => generateNote(i));
};

export const generateCustomNotesList: (noteInfo: Partial<Note>[]) => Note[] = (
  noteInfo
) => {
  return noteInfo.map((taskProperties, i) => ({
    ...generateNote(i, taskProperties),
  }));
};
