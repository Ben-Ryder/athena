import {NoteContent} from "./note.dto";

export interface CreateNoteDto extends NoteContent {
  userId: string;
}
