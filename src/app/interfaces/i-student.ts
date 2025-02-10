import { iFavourite } from './i-favourite';
import { iSector } from './i-sector';
import { iUser } from './i-user';

export interface iStudent {
  id?: number;
  appUser?: iUser;
  sectorsOfInterest?: iSector[];
  favorites?: iFavourite[];
}
