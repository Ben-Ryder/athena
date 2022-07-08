import {TagDto} from "../../tags/dtos/tag.dto-interface";

export interface NoteDto {
  id: string;
  title: string;
  body: string;
  tags: TagDto[];
  createdAt: Date;
  updatedAt: Date;
}
