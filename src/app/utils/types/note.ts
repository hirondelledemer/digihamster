export interface INote {
  id: number;
  title: string;
  content: string;
  json_content: object;
  deleted: boolean;
  user_id: string;
  created_at: string;
}
