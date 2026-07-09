export interface Attachment {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  file_name: string;
  mime_type: string;
  size: number;
  created_at?: string;
}
