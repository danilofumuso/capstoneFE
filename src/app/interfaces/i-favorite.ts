import { iMovie } from './i-movie';

export interface iFavorite {
  id?: number;
  userId: number;
  movie: iMovie;
}
