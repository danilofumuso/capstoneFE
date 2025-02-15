import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfessionalService } from '../../services/professional.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment.development';
import { iProfessionalDTO } from '../../interfaces/i-professional-dto';
import { iProfessionalWrittenStoryDTO } from '../../interfaces/i-professional-written-story-dto';
import { iUniversity } from '../../interfaces/i-university';
import { iFaculty } from '../../interfaces/i-faculty';
import { iDegreeCourse } from '../../interfaces/i-degree-course';
import { iSector } from '../../interfaces/i-sector';
import { iProfession } from '../../interfaces/i-profession';
import { iUser } from '../../interfaces/i-user';
import { iProfessionDTO } from '../../interfaces/i-profession-dto';
import { iEducationalPathDTO } from '../../interfaces/i-educational-path-dto';
import { iProfessional } from '../../interfaces/i-professional';

@Component({
  selector: 'app-professional-dashboard',
  templateUrl: './professional-dashboard.component.html',
  styleUrls: ['./professional-dashboard.component.scss'],
})
export class ProfessionalDashboardComponent implements OnInit {
  id!: number;
  user!: iUser;
  professional!: iProfessional;

  response: boolean = false;
  toastMessage?: string;

  editingDetails: boolean = false;
  editingPhoto: boolean = false;
  editingEducationalPath: boolean = false;
  editingProfession: boolean = false;
  editingWrittenStory: boolean = false;
  editingVideo: boolean = false;
  editingCurriculum: boolean = false;

  detailsForm!: FormGroup;
  educationalPathForm!: FormGroup;
  professionForm!: FormGroup;
  writtenStoryForm!: FormGroup;

  profilePicture: File | null = null;
  fileName: string = '';
  videoFile?: File | null = null;
  curriculumFile?: File | null = null;

  universities: iUniversity[] = [];
  faculties: iFaculty[] = [];
  degreeCourses: iDegreeCourse[] = [];
  sectorsList: iSector[] = [];
  professionsList: iProfession[] = [];

  universitiesUrl: string = environment.universitiesUrl;
  facultiesByUniversityUrl: string = environment.facultiesByUniversityUrl;
  degreeCoursesByFaculty: string = environment.degreeCoursesByFaculty;
  sectorsUrl: string = environment.sectorsUrl;
  professionsBySectorUrl: string = environment.professionsBySectorUrl;
  educationalPathsUrl: string = environment.educationalPathsUrl;

  constructor(
    private route: ActivatedRoute,
    private professionalService: ProfessionalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Sottoscriviti sempre al subject per avere i dati aggiornati
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.professional) {
          this.professional = user.professional;
        }
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = parseInt(idParam);
      this.getProfessional();
    }
    // Inizializza i form e carica le liste necessarie
    this.initForms();
    this.loadUniversities();
    this.loadSectors();
  }

  private updateAuthData(newProfessional: iProfessional): void {
    const currentAuth = this.authService.authSubject$.getValue();
    if (currentAuth && currentAuth.user) {
      const newAuth = {
        ...currentAuth,
        user: {
          ...currentAuth.user,
          professional: newProfessional,
        },
      };
      this.authService.authSubject$.next(newAuth);
      localStorage.setItem('accessData', JSON.stringify(newAuth));
    }
  }

  getProfessional(): void {
    this.professionalService.getProfessionalById(this.id).subscribe({
      next: (professional) => {
        this.professional = professional;

        if (this.user?.professional?.id === professional.id) {
          this.updateAuthData(professional);
        }
      },
      error: (err) => console.error('Professional not found!', err),
    });
  }

  get isOwner(): boolean {
    return (
      this.user &&
      this.professional &&
      this.user.professional?.id === this.professional.id
    );
  }

  initForms(): void {
    this.detailsForm = this.fb.group({
      name: [''],
      surname: [''],
      dateOfBirth: [''],
      username: [''],
      email: [''],
      password: [''],
    });

    this.educationalPathForm = this.fb.group({
      universityId: [''],
      facultyId: [''],
      degreeCourseId: [''],
    });

    this.professionForm = this.fb.group({
      sectorId: [''],
      id: [''],
    });

    this.writtenStoryForm = this.fb.group({
      writtenStory: [''],
    });
  }

  // ==================== Metodi per le select del PERCORSO FORMATIVO ====================

  loadUniversities(): void {
    this.http.get<iUniversity[]>(this.universitiesUrl).subscribe({
      next: (data) => {
        this.universities = data;
      },
      error: () => {
        console.error('Error loading universities:');
      },
    });
  }

  onUniversityChange(): void {
    const universityId = this.educationalPathForm.get('universityId')?.value;
    if (!universityId) {
      this.faculties = [];
      this.educationalPathForm.patchValue({
        facultyId: '',
        degreeCourseId: '',
      });
      this.degreeCourses = [];
      return;
    }

    this.http
      .get<iFaculty[]>(this.facultiesByUniversityUrl, {
        params: { universityId: universityId.toString() },
      })
      .subscribe({
        next: (faculties) => {
          this.faculties = faculties;
          this.educationalPathForm.patchValue({
            facultyId: '',
            degreeCourseId: '',
          });
          this.degreeCourses = [];
        },
        error: () => {
          console.error(
            `Error loading faculties for university ${universityId}:`
          );
        },
      });
  }

  onFacultyChange(): void {
    const facultyId = this.educationalPathForm.get('facultyId')?.value;
    if (!facultyId) {
      this.degreeCourses = [];
      this.educationalPathForm.patchValue({ degreeCourseId: '' });
      return;
    }

    this.http
      .get<iDegreeCourse[]>(this.degreeCoursesByFaculty, {
        params: { facultyId: facultyId.toString() },
      })
      .subscribe({
        next: (courses) => {
          this.degreeCourses = courses;
          this.educationalPathForm.patchValue({ degreeCourseId: '' });
        },
        error: () => {
          console.error(
            `Error loading degree courses for faculty ${facultyId}:`
          );
        },
      });
  }

  // ==================== Metodi per le select della PROFESSIONE ====================

  loadSectors(): void {
    this.http.get<iSector[]>(this.sectorsUrl).subscribe({
      next: (data) => {
        this.sectorsList = data;
      },
      error: (err) => {
        console.error('Error loading sectors:', err);
      },
    });
  }

  onSectorChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const sectorId = selectElement.value;
    if (!sectorId) {
      this.professionsList = [];
      this.professionForm.patchValue({ id: '' });
      return;
    }
    this.http
      .get<iProfession[]>(this.professionsBySectorUrl, {
        params: { sectorId: sectorId },
      })
      .subscribe({
        next: (data) => {
          this.professionsList = data;
          this.professionForm.patchValue({ id: '' });
        },
        error: () => {
          console.error(`Error loading professions for sector ${sectorId}:`);
        },
      });
  }

  // ==================== Metodi per le sezioni edit/view ====================

  editDetails(): void {
    this.editingDetails = true;
  }

  saveDetails(): void {
    if (this.detailsForm.valid) {
      const professionalDTO: iProfessionalDTO = this.detailsForm.value;
      this.professionalService.updateProfessional(professionalDTO).subscribe({
        next: (updated) => {
          if (updated.appUser) {
            // Aggiorna user e professional
            this.user = updated.appUser;
            this.professional = updated;
            // Sincronizza i dati nel subject e nel localStorage
            this.updateAuthData(updated);
          }
          this.editingDetails = false;
        },
        error: (err) => console.error('Error updating details', err),
      });
    }
  }

  cancelDetailsEdit(): void {
    this.editingDetails = false;
  }

  editPhoto(): void {
    this.editingPhoto = true;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.fileName = this.profilePicture.name;
    }
  }

  savePhoto(): void {
    if (this.profilePicture !== null) {
      this.professionalService
        .updateProfilePicture(this.profilePicture)
        .subscribe({
          next: (updated) => {
            if (updated.appUser) {
              this.user = updated.appUser;
              this.professional = updated;
              this.updateAuthData(updated);
            }
            this.editingPhoto = false;
          },
          error: (err) => console.error('Error updating photo', err),
        });
    }
  }

  deleteProfilePicture(): void {
    // Invia null al backend per eliminare la foto
    this.professionalService.updateProfilePicture(null).subscribe({
      next: (updated) => {
        if (updated.appUser) {
          this.user = updated.appUser;
          this.professional = updated;
          this.updateAuthData(updated);
        }
        this.profilePicture = null;
        this.fileName = '';
        this.editingPhoto = false;
        console.log('Profile picture removed:', updated);
      },
      error: (err) => console.error('Error deleting profile picture', err),
    });
  }

  handleProfilePicture(): void {
    if (this.profilePicture) {
      // Se è stato selezionato un file, salviamo la nuova foto
      this.savePhoto();
    } else {
      // Altrimenti, eliminiamo la foto (inviando null al backend)
      this.deleteProfilePicture();
    }
  }

  cancelPhotoEdit(): void {
    this.editingPhoto = false;
    this.fileName = '';
    this.profilePicture = null;
  }

  addEducationalPath(): void {
    this.editingEducationalPath = true;
  }

  saveEducationalPath(): void {
    if (this.educationalPathForm.valid) {
      const educationalPathDTO: iEducationalPathDTO =
        this.educationalPathForm.value;
      this.professionalService
        .updateEducationalPath(educationalPathDTO)
        .subscribe({
          next: (updated) => {
            if (updated.appUser) {
              this.user = updated.appUser;
              this.professional = updated;
              this.updateAuthData(updated);
            }
            this.editingEducationalPath = false;
            this.educationalPathForm.reset();
          },
          error: (err) => console.error('Error updating educational path', err),
        });
    }
  }

  deleteEducationalPath(pathId: number): void {
    this.http.delete(`${this.educationalPathsUrl}/${pathId}`).subscribe({
      next: (response) => {
        if (this.professional && this.professional.educationalPaths) {
          this.professional.educationalPaths =
            this.professional.educationalPaths.filter(
              (edu) => edu.id !== pathId
            );
        }
        this.updateAuthData(this.professional);
        console.log('Educational Path removed:', response);
      },
      error: (err) => console.error('Error deleting educational path', err),
    });
  }

  cancelEducationalPath(): void {
    this.editingEducationalPath = false;
    this.educationalPathForm.reset();
  }

  editProfession(): void {
    this.editingProfession = true;
  }

  saveProfession(): void {
    if (this.professionForm.valid) {
      const professionDTO: iProfessionDTO = this.professionForm.value;
      this.professionalService.updateProfession(professionDTO).subscribe({
        next: (updated) => {
          if (updated.appUser) {
            this.user = updated.appUser;
            this.professional = updated;
            this.updateAuthData(updated);
          }
          this.editingProfession = false;
          this.professionForm.reset();
        },
        error: (err) => console.error('Error updating profession', err),
      });
    }
  }

  cancelProfession(): void {
    this.editingProfession = false;
    this.professionForm.reset();
  }

  editWrittenStory(): void {
    this.editingWrittenStory = true;
  }

  saveWrittenStory(): void {
    if (this.writtenStoryForm.valid) {
      const writtenStoryDTO: iProfessionalWrittenStoryDTO =
        this.writtenStoryForm.value;
      this.professionalService.updateWrittenStory(writtenStoryDTO).subscribe({
        next: (updated) => {
          if (updated.appUser) {
            this.user = updated.appUser;
            this.professional = updated;
            this.updateAuthData(updated);
          }
          this.editingWrittenStory = false;
          this.writtenStoryForm.reset();
        },
        error: (err) => console.error('Error updating written story', err),
      });
    }
  }

  cancelWrittenStory(): void {
    this.editingWrittenStory = false;
    this.writtenStoryForm.reset();
  }

  editVideo(): void {
    this.editingVideo = true;
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
      this.fileName = this.videoFile.name;
    }
  }

  saveVideo(): void {
    if (this.videoFile !== null) {
      this.professionalService.updateVideoStory(this.videoFile).subscribe({
        next: (updated) => {
          if (updated.appUser) {
            this.user = updated.appUser;
            this.professional = updated;
            this.updateAuthData(updated);
          }
          this.editingVideo = false;
        },
        error: (err) => console.error('Error updating video', err),
      });
    }
  }

  deleteVideo(): void {
    this.professionalService.updateVideoStory(null).subscribe({
      next: (updated) => {
        if (updated.appUser) {
          this.user = updated.appUser;
          this.professional = updated;
          this.updateAuthData(updated);
        }
        this.videoFile = null;
        this.fileName = '';
        this.editingVideo = false;
        console.log('Profile picture removed:', updated);
      },
      error: (err) => console.error('Error deleting profile picture', err),
    });
  }

  handleVideo(): void {
    if (this.videoFile) {
      this.saveVideo();
    } else {
      this.deleteVideo();
    }
  }

  cancelVideo(): void {
    this.editingVideo = false;
    this.fileName = '';
    this.videoFile = null;
  }

  editCurriculum(): void {
    this.editingCurriculum = true;
  }

  onCurriculumSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.curriculumFile = input.files[0];
      this.fileName = this.curriculumFile.name;
    }
  }

  saveCurriculum(): void {
    if (this.curriculumFile) {
      this.professionalService
        .updateCurriculumVitae(this.curriculumFile)
        .subscribe({
          next: (updated) => {
            if (updated.appUser) {
              this.user = updated.appUser;
              this.professional = updated;
              this.updateAuthData(updated);
            }
            this.editingCurriculum = false;
          },
          error: (err) => console.error('Error updating curriculum', err),
        });
    }
  }

  cancelCurriculum(): void {
    this.editingCurriculum = false;
  }

  deleteProfessional(): void {
    this.professionalService.deleteProfessional().subscribe({
      next: () => {
        this.response = true;
        this.toastMessage = 'Account deleted successfully!';
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
        this.authService.logout();
      },
      error: (err) => console.error('Error deleting professional', err),
    });
  }

  clearToast(): void {
    this.toastMessage = '';
    this.response = false;
  }
}
