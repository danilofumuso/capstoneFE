import { iFaculty } from './i-faculty';

export interface iUniversity {
  id?: number;
  name?: string;
  faculties?: iFaculty[];
}
