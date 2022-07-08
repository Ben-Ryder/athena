import {NoteDto} from "../dtos/note.dto-interface";
import {MetaPaginationResponseSchema} from "../../common/pagination-meta.response-schema";

export interface GetNotesResponse {
  notes: NoteDto[];
  meta: MetaPaginationResponseSchema;
}
