import {IsEnum, IsOptional} from 'class-validator';
import {PaginationQueryParamsSchema} from "../../common/pagination-query-params-schema";
import {IsArrayOfUUIDArrays} from "../../../utils/is-array-of-uuid-arrays";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export class NotesQueryParamsSchema extends PaginationQueryParamsSchema {
    @IsArrayOfUUIDArrays()
    @IsOptional()
    tags?: string[][];

    @IsEnum(OrderByFields)
    @IsOptional()
    orderBy?: OrderByFields

    @IsEnum(OrderDirections)
    @IsOptional()
    orderDirection?: OrderDirections
}
