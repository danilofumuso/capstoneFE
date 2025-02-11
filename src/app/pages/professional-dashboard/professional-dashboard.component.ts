import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfessionalService } from '../../services/professional.service';
import { iProfessional } from '../../interfaces/i-professional';

@Component({
  selector: 'app-professional-dashboard',
  templateUrl: './professional-dashboard.component.html',
  styleUrl: './professional-dashboard.component.scss',
})
export class ProfessionalDashboardComponent implements OnInit {
  id!: number;
  professional!: iProfessional;

  constructor(
    private route: ActivatedRoute,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.id = parseInt(id);

    this.professionalService.getProfessionalById(this.id).subscribe({
      next: (data) => {
        this.professional = data;
      },
      error: (error) => {
        console.error('Professional not found!', error);
      },
    });
  }
}
