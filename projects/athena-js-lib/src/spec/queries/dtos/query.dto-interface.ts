import {TagDto} from "../../tags/dtos/tag.dto-interface";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export interface QueryDto {
  id: string;
  name: string;
  tags: TagDto[][];
  orderBy: OrderByFields;
  orderDirection: OrderDirections
  createdAt: string;
  updatedAt: string;
}
