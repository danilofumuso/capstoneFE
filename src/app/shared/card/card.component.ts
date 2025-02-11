import { Component, Input } from '@angular/core';
import { iProfessional } from '../../interfaces/i-professional';
import { iFavourite } from '../../interfaces/i-favourite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() professional!: iProfessional;
  @Input() favourite!: iFavourite;

  constructor(private router: Router) {}

  goToProfessionalPage(id: number) {
    this.router.navigate(['professionalDashboard', id]);
  }
}
