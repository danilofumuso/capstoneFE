import { iDegreeCourse } from './i-degree-course';

export interface iFaculty {
  id?: number;
  name?: string;
  degreeCourses?: iDegreeCourse[];
}
