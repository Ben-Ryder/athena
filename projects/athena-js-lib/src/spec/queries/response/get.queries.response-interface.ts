import {QueryDto} from "../dtos/query.dto-interface";
import {MetaPaginationResponseSchema} from "../../common/pagination-meta.response-schema";

export interface GetQueriesResponse {
  queries: QueryDto[];
  meta: MetaPaginationResponseSchema;
}
