import { iFavourite } from './i-favourite';
import { iProfessional } from './i-professional';

export interface iPage {
  totalElements: number;
  totalPages: number;
  size: number;
  content: iProfessional[] | iFavourite[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: Pageable;
  empty: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}
