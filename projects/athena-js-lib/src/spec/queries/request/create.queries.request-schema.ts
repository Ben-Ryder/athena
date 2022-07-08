import {IsEnum, IsOptional, IsString, MinLength} from 'class-validator';
import {IsUUIDArray} from "../../../utils/is-uuid-array";
import {TagDto} from "../../tags/dtos/tag.dto-interface";
import {IsArrayOfUUIDArrays} from "../../../utils/is-array-of-uuid-arrays";
import {OrderByFields} from "../../common/order-by-fields";
import {OrderDirections} from "../../common/order-directions";


export class CreateQueryRequestSchema {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsArrayOfUUIDArrays()
  tags!: string[][];

  @IsEnum(OrderByFields)
  orderBy!: OrderByFields;

  @IsEnum(OrderDirections)
  orderDirection!: OrderDirections;
}
