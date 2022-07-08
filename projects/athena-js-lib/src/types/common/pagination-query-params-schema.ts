/**
 * Pagination query parameters.
 */
import {IsNumber, IsOptional} from "class-validator";

export class PaginationQueryParamsSchema {
  @IsNumber()
  @IsOptional()
  take?: number;

  @IsNumber()
  @IsOptional()
  skip?: number;
}
