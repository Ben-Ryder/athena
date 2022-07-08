import {TagDto} from "../dtos/tag.dto-interface";
import {MetaPaginationResponseSchema} from "../../common/pagination-meta.response-schema";

export interface GetTagsResponse {
  tags: TagDto[];
  meta: MetaPaginationResponseSchema
}
