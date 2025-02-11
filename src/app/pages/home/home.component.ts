import { ProfessionalService } from './../../services/professional.service';
import { Component, OnInit } from '@angular/core';
import { iProfessional } from '../../interfaces/i-professional';
import { FormBuilder, FormGroup } from '@angular/forms';
import { iSector } from '../../interfaces/i-sector';
import { iProfession } from '../../interfaces/i-profession';
import { iProfessionDTO } from '../../interfaces/i-profession-dto';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { iPage } from '../../interfaces/i-page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  professionals: iProfessional[] = [];
  form!: FormGroup;
  sectorsList: iSector[] = [];
  professionsList: iProfession[] = [];

  sectorsUrl: string = environment.sectorsUrl;
  professionsBySectorUrl: string = environment.professionsBySectorUrl;

  currentPage: number = 1;

  pageable: iPage = {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    content: [],
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    numberOfElements: 0,
    first: true,
    last: true,
    pageable: {
      offset: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageSize: 10,
      pageNumber: 0,
      paged: true,
      unpaged: false,
    },
    empty: true,
  };

  constructor(
    private professionalService: ProfessionalService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sectorId: [''],
      professionId: [''],
    });

    this.loadInitialProfessionals();

    this.loadSectors();
  }

  loadInitialProfessionals(): void {
    this.professionalService
      .getProfessionalsByStudentSectorsOfInterest(this.currentPage - 1)
      .subscribe({
        next: (response) => {
          this.pageable = response;
          this.currentPage = response.number + 1;
          this.professionals = response.content as iProfessional[];
        },
        error: (error) => {
          console.error('Error loading initial professionals:', error);
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
        error: (error) => {
          console.error(
            `Error loading professions for sector ${sectorId}:`,
            error
          );
        },
      });
  }

  onFilter(): void {
    const filter: iProfessionDTO = {};
    const sectorIdValue = this.form.get('sectorId')?.value;
    const professionIdValue = this.form.get('professionId')?.value;

    if (sectorIdValue) {
      filter.sectorId = +sectorIdValue;
    }
    if (professionIdValue) {
      filter.id = +professionIdValue;
    }

    if (!filter.sectorId && !filter.id) {
      this.loadInitialProfessionals();
    } else {
      this.professionalService
        .getProfessionalsFiltered(filter, this.currentPage - 1)
        .subscribe({
          next: (response) => {
            this.pageable = response;
            this.currentPage = response.number + 1;
            this.professionals = response.content as iProfessional[];
          },
          error: (error) => {
            console.error('Error filtering professionals:', error);
          },
        });
    }
  }

  pageChanged(page: number): void {
    this.currentPage = page;
    this.onFilter();
  }
}
