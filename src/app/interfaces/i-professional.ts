import { iProfession } from './i-profession';
import { iUniversity } from './i-university';
import { iUser } from './i-user';

export interface iProfessional {
  user: iUser;
  universities: iUniversity[];
  profession: iProfession;
}
