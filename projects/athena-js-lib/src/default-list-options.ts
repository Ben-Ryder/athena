import {OrderByFields} from "./spec/common/order-by-fields";
import {OrderDirections} from "./spec/common/order-directions";

export const DefaultListOptions = {
  take: 24,
  skip: 0,
  orderBy: OrderByFields.UPDATED_AT,
  orderDirection: OrderDirections.ASC
}

export const DefaultVaultsListOptions = DefaultListOptions;
export const DefaultNotesListOptions = DefaultListOptions;
export const DefaultTagsListOptions = DefaultListOptions;
export const DefaultQueriesListOptions = DefaultListOptions;
