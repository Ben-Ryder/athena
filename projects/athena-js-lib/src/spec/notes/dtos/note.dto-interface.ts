import {TagDto} from "../../tags/dtos/tag.dto-interface";
import {NoteContentDto} from "./note-content.dto-interface";

export interface NoteDto extends NoteContentDto {
  id: string;
  tags: TagDto[];
  createdAt: string;
  updatedAt: string;
}
