import {NoteContent} from "./note.dto";

export interface CreateNoteDto extends NoteContent {}

export interface CreateNoteWithUserDto extends CreateNoteDto {
  userId: string;
}
