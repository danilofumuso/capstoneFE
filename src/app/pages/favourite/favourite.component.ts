import { FavouriteService } from './../../services/favourite.service';
import { Component, OnInit } from '@angular/core';
import { iProfessional } from '../../interfaces/i-professional';
import { iPage } from '../../interfaces/i-page';
import { iFavourite } from '../../interfaces/i-favourite';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.scss',
})
export class FavouriteComponent implements OnInit {
  professionals: iProfessional[] = [];
  favourites: iFavourite[] = [];
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

  constructor(private favouriteService: FavouriteService) {}

  ngOnInit(): void {
    this.loadInitialProfessionals();
  }

  loadInitialProfessionals(): void {
    this.favouriteService.getFavourites(this.currentPage - 1).subscribe({
      next: (response) => {
        this.pageable = response;
        this.currentPage = response.number + 1;
        this.favourites = response.content as iFavourite[];
        this.professionals = this.favourites.map((fav) => fav.professional);
      },
      error: (error) => {
        console.error('Error loading initial professionals:', error);
      },
    });
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }
}
