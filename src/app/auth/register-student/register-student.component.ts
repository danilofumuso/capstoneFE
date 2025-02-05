import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iSector } from '../../interfaces/i-sector';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.scss',
})
export class RegisterStudentComponent implements OnInit {
  form!: FormGroup;
  profilePicture?: File;
  sectorsList: iSector[] = [];
  selectedSectors: number[] = [];

  alertMessage?: string;
  alertType: 'success' | 'danger' = 'success';

  sectorsUrl: string = environment.sectorsUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: [''],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      sectorsOfInterestId: [[], Validators.required],
    });

    this.http.get<iSector[]>(this.sectorsUrl).subscribe({
      next: (data) => {
        this.sectorsList = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento settori:', err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file: File = input.files[0];
    this.profilePicture = file;
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

    const registerDtoPayload = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      dateOfBirth: this.form.value.dateOfBirth,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      sectorsOfInterestId: this.form.value.sectorsOfInterestId,
    };

    const formData = new FormData();
    formData.append('appUser', JSON.stringify(registerDtoPayload));

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    this.authService.registerStudent(formData).subscribe({
      next: (res) => {
        this.alertType = 'success';
        this.alertMessage = 'Student successfully registered!';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.alertType = 'danger';
        this.alertMessage = 'Error while registering';
      },
    });
  }

  clearAlert(): void {
    this.alertMessage = '';
  }
}
