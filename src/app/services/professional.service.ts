import { iProfessionalWrittenStoryDTO } from './../interfaces/i-professional-written-story-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { iPage } from '../interfaces/i-page';
import { iProfessional } from '../interfaces/i-professional';
import { iProfessionalDTO } from '../interfaces/i-professional-dto';
import { iEducationalPathDTO } from '../interfaces/i-educational-path-dto';
import { iProfessionDTO } from '../interfaces/i-profession-dto';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private professionalsUrl = environment.professionalsUrl;
  private professionalsFilteredUrl = environment.professionalsFilteredUrl;
  private professionalsByStudentSectorsOfInterestUrl =
    environment.professionalsByStudentSectorsOfInterestUrl;
  private professionalEducationalPathUrl =
    environment.professionalEducationalPathUrl;
  private professionalProfessionUrl = environment.professionalProfessionUrl;
  private professionalprofilePictureUrl =
    environment.professionalProfilePictureUrl;
  private professionalWrittenStoryUrl = environment.professionalWrittenStoryUrl;
  private professionalVideoStoryUrl = environment.professionalVideoStoryUrl;
  private professionalCurriculumVitaeUrl =
    environment.professionalCurriculumVitaeUrl;

  constructor(private http: HttpClient) {}

  getAllProfessionals(page: number = 0, size: number = 8): Observable<iPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<iPage>(this.professionalsUrl, { params });
  }

  getProfessionalsByStudentSectorsOfInterest(
    page: number = 0,
    size: number = 8
  ): Observable<iPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<iPage>(
      this.professionalsByStudentSectorsOfInterestUrl,
      {
        params,
      }
    );
  }

  getProfessionalsFiltered(
    professionDTO: iProfessionDTO,
    page: number = 0,
    size: number = 8
  ): Observable<iPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.post<iPage>(this.professionalsFilteredUrl, professionDTO, {
      params,
    });
  }

  getProfessionalById(id: number): Observable<iProfessional> {
    return this.http.get<iProfessional>(`${this.professionalsUrl}/${id}`);
  }

  updateProfessional(
    professionalDTO: iProfessionalDTO
  ): Observable<iProfessional> {
    return this.http.put<iProfessional>(this.professionalsUrl, professionalDTO);
  }

  updateEducationalPath(
    educationalPathDTO: iEducationalPathDTO
  ): Observable<iProfessional> {
    return this.http.patch<iProfessional>(
      this.professionalEducationalPathUrl,
      educationalPathDTO
    );
  }

  updateProfession(professionDTO: iProfessionDTO): Observable<iProfessional> {
    return this.http.patch<iProfessional>(
      this.professionalProfessionUrl,
      professionDTO
    );
  }

  updateProfilePicture(
    profilePicture?: File | null
  ): Observable<iProfessional> {
    const formData = new FormData();
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    return this.http.patch<iProfessional>(
      this.professionalprofilePictureUrl,
      formData
    );
  }

  updateWrittenStory(
    writtenStory: iProfessionalWrittenStoryDTO
  ): Observable<iProfessional> {
    return this.http.patch<iProfessional>(
      this.professionalWrittenStoryUrl,
      writtenStory
    );
  }

  updateVideoStory(videoStory?: File | null): Observable<iProfessional> {
    const formData = new FormData();
    if (videoStory) {
      formData.append('videoStory', videoStory);
    }
    return this.http.patch<iProfessional>(
      this.professionalVideoStoryUrl,
      formData
    );
  }

  updateCurriculumVitae(
    curriculumVitae?: File | null
  ): Observable<iProfessional> {
    const formData = new FormData();
    if (curriculumVitae) {
      formData.append('curriculumVitae', curriculumVitae);
    }
    return this.http.patch<iProfessional>(
      this.professionalCurriculumVitaeUrl,
      formData
    );
  }

  deleteProfessional(): Observable<void> {
    return this.http.delete<void>(this.professionalsUrl);
  }
}
