import { Role } from '../enums/role';
import { iProfessional } from './i-professional';
import { iStudent } from './i-student';

export interface iUser {
  id: number;
  name: string;
  surname: string;
  dateOfBirth: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  roles: Role[];
  student?: iStudent;
  professional?: iProfessional;
}
