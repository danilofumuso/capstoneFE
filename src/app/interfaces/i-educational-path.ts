import { iDegreeCourse } from './i-degree-course';
import { iFaculty } from './i-faculty';
import { iProfessional } from './i-professional';
import { iUniversity } from './i-university';

export interface iEducationalPath {
  id?: number;
  professional?: iProfessional;
  university?: iUniversity;
  faculty?: iFaculty;
  degreeCourse?: iDegreeCourse;
}
