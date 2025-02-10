import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iUniversity } from '../../interfaces/i-university';
import { iFaculty } from '../../interfaces/i-faculty';
import { iDegreeCourse } from '../../interfaces/i-degree-course';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { iSector } from '../../interfaces/i-sector';
import { iProfession } from '../../interfaces/i-profession';
import { AuthService } from '../auth.service';
import { iRegisterDTO } from '../../interfaces/i-register-dto';

@Component({
  selector: 'app-register-professional',
  templateUrl: './register-professional.component.html',
  styleUrl: './register-professional.component.scss',
})
export class RegisterProfessionalComponent {
  form!: FormGroup;
  profilePicture?: File;
  fileName: string = '';

  universities: iUniversity[] = [];
  facultiesOptions: { [index: number]: iFaculty[] } = {};
  coursesOptions: { [index: number]: iDegreeCourse[] } = {};

  sectorsList: iSector[] = [];
  professionsList: iProfession[] = [];

  response: boolean = false;
  toastMessage?: string;

  universitiesUrl: string = environment.universitiesUrl;
  facultiesByUniversityUrl: string = environment.facultiesByUniversityUrl;
  degreeCoursesByFaculty: string = environment.degreeCousersByFaculty;
  sectorsUrl: string = environment.sectorsUrl;
  professionsBySectorUrl: string = environment.professionsBySectorUrl;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      sectorId: ['', Validators.required],
      professionId: ['', Validators.required],
      educationalPaths: this.fb.array([]),
    });

    this.loadUniversities();
    this.loadSectors();
    this.addEducationalPath();
  }

  get educationalPaths(): FormArray {
    return this.form.get('educationalPaths') as FormArray;
  }

  addEducationalPath(): void {
    const group = this.fb.group({
      universityId: ['', Validators.required],
      facultyId: ['', Validators.required],
      degreeCourseId: ['', Validators.required],
    });
    this.educationalPaths.push(group);
  }

  removeEducationalPath(index: number): void {
    this.educationalPaths.removeAt(index);
    delete this.facultiesOptions[index];
    delete this.coursesOptions[index];
  }

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

  onUniversityChange(index: number): void {
    const group = this.educationalPaths.at(index) as FormGroup;
    const universityId = group.get('universityId')?.value;
    if (!universityId) {
      this.facultiesOptions[index] = [];
      group.patchValue({ facultyId: '', degreeCourseId: '' });
      this.coursesOptions[index] = [];
      return;
    }

    this.http
      .get<iFaculty[]>(this.facultiesByUniversityUrl, {
        params: { universityId: universityId.toString() },
      })
      .subscribe({
        next: (faculties) => {
          this.facultiesOptions[index] = faculties;
          group.patchValue({ facultyId: '', degreeCourseId: '' });
          this.coursesOptions[index] = [];
        },
        error: () => {
          console.error(
            `Error loading faculties for university ${universityId}:`
          );
        },
      });
  }

  onFacultyChange(index: number): void {
    const group = this.educationalPaths.at(index) as FormGroup;
    const facultyId = group.get('facultyId')?.value;
    if (!facultyId) {
      this.coursesOptions[index] = [];
      group.patchValue({ degreeCourseId: '' });
      return;
    }

    this.http
      .get<iDegreeCourse[]>(this.degreeCoursesByFaculty, {
        params: { facultyId: facultyId.toString() },
      })
      .subscribe({
        next: (courses) => {
          this.coursesOptions[index] = courses;
          group.patchValue({ degreeCourseId: '' });
        },
        error: () => {
          console.error(
            `Error loading degree courses for faculty ${facultyId}:`
          );
        },
      });
  }

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
      this.form.patchValue({ professionId: '' });
      return;
    }
    this.http
      .get<iProfession[]>(this.professionsBySectorUrl, {
        params: { sectorId: sectorId },
      })
      .subscribe({
        next: (data) => {
          this.professionsList = data;
          this.form.patchValue({ professionId: '' });
        },
        error: () => {
          console.error(`Error loading professions for sector ${sectorId}:`);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.fileName = this.profilePicture.name;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const payload: iRegisterDTO = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      dateOfBirth: this.form.value.dateOfBirth,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      professionId: this.form.value.professionId,
      educationalPaths: this.form.value.educationalPaths,
    };

    const formData = new FormData();
    formData.append('appUser', JSON.stringify(payload));
    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    this.authService.registerProfessional(formData).subscribe({
      next: () => {
        this.response = true;
        this.toastMessage = 'Professional successfully registered!';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: () => {
        this.response = false;
        this.toastMessage = 'Server error while registering!';
        setTimeout(() => {
          this.clearToast();
        }, 3000);
      },
    });
  }

  clearToast(): void {
    this.toastMessage = '';
    this.response = false;
  }
}
