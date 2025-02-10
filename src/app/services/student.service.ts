import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { iStudent } from '../interfaces/i-student';
import { iStudentDTO } from '../interfaces/i-student-dto';
import { iStudentSectorsOfInterestDTO } from '../interfaces/i-student-sectors-of-interest-dto';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private studentsUrl = environment.studentsUrl;
  private studentSectorsOfInterestUrl = environment.studentSectorsOfInterestUrl;
  private studentProfilePictureUrl = environment.studentProfilePictureUrl;

  constructor(private http: HttpClient) {}

  updateStudent(studentDTO: iStudentDTO): Observable<iStudent> {
    return this.http.put<iStudent>(this.studentsUrl, studentDTO);
  }

  updateSectorsOfInterest(
    sectors: iStudentSectorsOfInterestDTO
  ): Observable<iStudent> {
    return this.http.patch<iStudent>(this.studentSectorsOfInterestUrl, sectors);
  }

  updateProfilePicture(profilePicture?: File): Observable<iStudent> {
    const formData = new FormData();
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    return this.http.patch<iStudent>(this.studentProfilePictureUrl, formData);
  }

  deleteStudent(): Observable<void> {
    return this.http.delete<void>(this.studentsUrl);
  }
}
