import { Role } from '../enums/role';
import { iProfessional } from './i-professional';
import { iStudent } from './i-student';

export interface iUser {
  id: number;
  name: String;
  surname: String;
  dateOfBirth: String;
  username: String;
  email: String;
  password: String;
  profilePicture?: String;
  roles: Role[];
  student?: iStudent;
  professional?: iProfessional;
}
