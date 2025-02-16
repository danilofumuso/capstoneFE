import { iProfessional } from './i-professional';
import { iStudent } from './i-student';

export interface iFavourite {
  id?: number;
  student: iStudent;
  professional: iProfessional;
  savedAt: string;
}
