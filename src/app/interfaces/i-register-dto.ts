import { iEducationalPathDTO } from './i-educational-path-dto';

export interface iRegisterDTO {
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  username?: string;
  email?: string;
  password?: string;

  sectorsOfInterest?: string[];

  educationalPaths?: iEducationalPathDTO[];
  professionName?: string;
}
