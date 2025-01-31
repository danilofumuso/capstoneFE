import { iFavourite } from './i-favorite';
import { iSector } from './i-sector';
import { iUser } from './i-user';

export interface iStudent {
  user: iUser;
  sectorsOfInterest: iSector[];
  favorites: iFavourite[];
}
