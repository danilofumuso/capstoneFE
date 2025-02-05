import { iEducationalPath } from './i-educational-path';
import { iProfession } from './i-profession';
import { iUser } from './i-user';

export interface iProfessional {
  id?: number;
  user?: iUser;
  educationalPaths?: iEducationalPath[];
  profession?: iProfession;
  writtenStory?: string;
  videoStory?: string;
  curriculumVitae?: string;
}
