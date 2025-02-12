import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../../auth/auth.service';
import { iSector } from '../../interfaces/i-sector';
import { iUser } from '../../interfaces/i-user';
import { iStudentDTO } from '../../interfaces/i-student-dto';
import { iStudentSectorsOfInterestDTO } from '../../interfaces/i-student-sectors-of-interest-dto';
import { StudentService } from '../../services/student.service';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  student!: iUser;
  sectorsOfInterest: iSector[] = [];

  sectorsList: iSector[] = [];
  selectedSectors: number[] = [];

  editingPhoto: boolean = false;
  editingDetails: boolean = false;
  editingSectorsOfInterest: boolean = false;

  detailsForm!: FormGroup;
  sectorsOfInterestForm!: FormGroup;
  profilePicture?: File;
  fileName: string = '';

  sectorsUrl: string = environment.sectorsUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.student = user;
          if (user.student?.sectorsOfInterest) {
            this.sectorsOfInterest = user.student.sectorsOfInterest;
          }
        }
      },
      error: (err) => console.error('User not found!', err),
    });
    this.loadSectors();
    this.initForms();
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

    this.sectorsOfInterestForm = this.fb.group({
      sectorsOfInterestId: [[]],
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

  onSectorSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const selectedId = Number(selectedValue);
    if (selectedId && !this.selectedSectors.includes(selectedId)) {
      this.selectedSectors.push(selectedId);
      this.sectorsOfInterestForm.patchValue({
        sectorsOfInterestId: this.selectedSectors,
      });
    }
    selectElement.value = '';
  }

  removeSector(sectorId: number): void {
    this.selectedSectors = this.selectedSectors.filter((s) => s !== sectorId);
    this.sectorsOfInterestForm.patchValue({
      sectorsOfInterestId: this.selectedSectors,
    });
  }

  getSectorNameById(sectorId: number): string | undefined {
    const found = this.sectorsList.find((sector) => sector.id === sectorId);
    return found ? found.name : sectorId.toString();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.fileName = this.profilePicture.name;
    }
  }

  savePhoto(): void {
    if (this.profilePicture) {
      this.studentService.updateProfilePicture(this.profilePicture).subscribe({
        next: (updatedStudent) => {
          if (updatedStudent.appUser) {
            this.student = updatedStudent.appUser;
          }
          this.editingPhoto = false;
          this.profilePicture = undefined;
        },
        error: (err) => console.error('Error updating profile picture', err),
      });
    }
  }

  cancelPhotoEdit(): void {
    this.editingPhoto = false;
    this.profilePicture = undefined;
  }

  saveDetails(): void {
    if (this.detailsForm.valid) {
      const studentDTO: iStudentDTO = this.detailsForm.value;
      this.studentService.updateStudent(studentDTO).subscribe({
        next: (updatedStudent) => {
          if (updatedStudent.appUser) {
            this.student = updatedStudent.appUser;
          }
          this.editingDetails = false;
          this.detailsForm.reset();
        },
        error: (err) => console.error('Error updating details', err),
      });
    }
  }

  cancelDetailsEdit(): void {
    this.editingDetails = false;
    this.detailsForm.reset();
  }

  saveSectorsOfInterest(): void {
    if (this.sectorsOfInterestForm.valid) {
      const sectorsDTO: iStudentSectorsOfInterestDTO =
        this.sectorsOfInterestForm.value;
      this.studentService.updateSectorsOfInterest(sectorsDTO).subscribe({
        next: (updatedStudent) => {
          if (updatedStudent.appUser) {
            this.student = updatedStudent.appUser;
          }
          if (updatedStudent.appUser?.student?.sectorsOfInterest) {
            this.sectorsOfInterest =
              updatedStudent.appUser.student.sectorsOfInterest;
          }
          this.editingSectorsOfInterest = false;
          this.selectedSectors = [];
          this.sectorsOfInterestForm.reset({ sectorsOfInterestId: [] });
        },
        error: (err) =>
          console.error('Error updating sectors of interest', err),
      });
    }
  }

  cancelSectorsEdit(): void {
    this.editingSectorsOfInterest = false;
    this.selectedSectors = [];
    this.sectorsOfInterestForm.reset({ sectorsOfInterestId: [] });
  }
}
