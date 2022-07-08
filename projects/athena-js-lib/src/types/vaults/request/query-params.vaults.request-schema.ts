import {IsEnum, IsOptional} from 'class-validator';
import {PaginationQueryParamsSchema} from "../../common/pagination-query-params-schema";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export class VaultsQueryParamsSchema extends PaginationQueryParamsSchema {
    @IsEnum(OrderByFields)
    @IsOptional()
    orderBy?: OrderByFields

    @IsEnum(OrderDirections)
    @IsOptional()
    orderDirection?: OrderDirections
}
