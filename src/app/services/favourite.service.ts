import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { iPage } from '../interfaces/i-page';
import { Observable } from 'rxjs';
import { iFavourite } from '../interfaces/i-favourite';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private favouritesUrl = environment.favouritesUrl;

  constructor(private http: HttpClient) {}

  getFavourites(page: number = 0, size: number = 10): Observable<iPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<iPage>(this.favouritesUrl, { params });
  }

  addFavourite(professionalId: number): Observable<iFavourite> {
    return this.http.post<iFavourite>(
      `${this.favouritesUrl}/${professionalId}`,
      {}
    );
  }

  removeFavourite(favouriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.favouritesUrl}/${favouriteId}`);
  }
}
