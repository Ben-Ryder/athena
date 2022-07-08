import {VaultDto} from "../dtos/vault.dto-interface";
import {MetaPaginationResponseSchema} from "../../common/pagination-meta.response-schema";

export interface GetVaultsResponse {
  vaults: VaultDto[],
  meta: MetaPaginationResponseSchema;
}
