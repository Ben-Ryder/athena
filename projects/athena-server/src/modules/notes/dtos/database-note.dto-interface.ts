import {NoteDto} from "@ben-ryder/athena-js-lib";

export interface DatabaseNoteDto extends NoteDto {
  userId: string;
}