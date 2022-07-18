import {OrderByFields, OrderDirections} from "@ben-ryder/athena-js-lib";

export interface DatabaseListOptions {
  take: number,
  skip: number,
  orderBy: OrderByFields,
  orderDirection: OrderDirections
}