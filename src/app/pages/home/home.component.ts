import { ProfessionalService } from './../../services/professional.service';
import { Component, OnInit } from '@angular/core';
import { iProfessional } from '../../interfaces/i-professional';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  professionals: iProfessional[] = [];

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.professionalService
      .getProfessionalsBySector()
      .subscribe((response) => (this.professionals = response.content));
  }
}
