import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iSector } from '../../interfaces/i-sector';
import { environment } from '../../../environments/environment.development';
import { iRegisterDTO } from '../../interfaces/i-register-dto';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.scss',
})
export class RegisterStudentComponent implements OnInit {
  form!: FormGroup;
  profilePicture?: File;
  fileName: string = '';
  sectorsList: iSector[] = [];
  selectedSectors: number[] = [];

  toastMessage?: string;
  response: boolean = false;

  sectorsUrl: string = environment.sectorsUrl;

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
      sectorsOfInterestId: [[]],
    });

    this.loadSectors();
  }

  loadSectors(): void {
    this.http.get<iSector[]>(this.sectorsUrl).subscribe({
      next: (data) => {
        this.sectorsList = data;
      },
      error: (err) => console.error('Error while loading sectors!', err),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.fileName = this.profilePicture.name;
    }
  }

  onSectorSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const selectedId = Number(selectedValue);
    if (selectedId && !this.selectedSectors.includes(selectedId)) {
      this.selectedSectors.push(selectedId);
      this.form.patchValue({
        sectorsOfInterestId: this.selectedSectors,
      });
    }
    selectElement.value = '';
  }

  removeSector(sectorId: number): void {
    this.selectedSectors = this.selectedSectors.filter((s) => s !== sectorId);
    this.form.patchValue({
      sectorsOfInterestId: this.selectedSectors,
    });
  }

  getSectorNameById(sectorId: number): string | undefined {
    const found = this.sectorsList.find((sector) => sector.id === sectorId);
    return found ? found.name : sectorId.toString();
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
      sectorsOfInterestId: this.form.value.sectorsOfInterestId,
    };

    const formData = new FormData();
    formData.append('appUser', JSON.stringify(payload));

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    this.authService.registerStudent(formData).subscribe({
      next: (res) => {
        this.response = true;
        this.toastMessage = 'Student successfully registered!';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
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
