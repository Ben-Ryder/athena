import {IsString, MinLength, IsOptional, IsEnum} from 'class-validator';
import {IsUUIDArray} from "../../../utils/is-uuid-array";
import {IsArrayOfUUIDArrays} from "../../../utils/is-array-of-uuid-arrays";
import {OrderByFields} from "../../common/order-by-fields";
import {OrderDirections} from "../../common/order-directions";

// todo: generate from CreateQueryRequestSchema as all fields are the same?
export class UpdateQueryRequestSchema {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsArrayOfUUIDArrays()
  @IsOptional()
  tags?: string[][];

  @IsEnum(OrderByFields)
  @IsOptional()
  orderBy?: OrderByFields;

  @IsEnum(OrderDirections)
  @IsOptional()
  orderDirection?: OrderDirections;
}
