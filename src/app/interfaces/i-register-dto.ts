import { iEducationalPathDTO } from './i-educational-path-dto';

export interface iRegisterDTO {
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  username?: string;
  email?: string;
  password?: string;

  sectorsOfInterestId?: number[];

  educationalPaths?: iEducationalPathDTO[];
  professionId?: number;
}
