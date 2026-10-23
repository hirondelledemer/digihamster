export interface INote {
  id: number;
  title: string;
  content: string;
  json_content: object;
  deleted: boolean;
  user_id: string;
  created_at: string;
}

/** How a note is physically held onto whatever it is shown against. */
export type StickyNoteVariant = "pin" | "tape";
