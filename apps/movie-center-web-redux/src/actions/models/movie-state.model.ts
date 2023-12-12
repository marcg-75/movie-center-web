import { IMovie, MovieFilter } from '../../models/movie.model';
import { LoadingState } from './loading.model';

export interface MovieListStateModel {
  filter: MovieFilter;
  movies?: IMovie[];
  moviesNotLoaded: boolean;
  movieListErrorMessages?: string[];
}

export interface MovieStateModel {
  movieItem?: IMovie;
  movieLoading: LoadingState;
  movieCreated: boolean;
  movieUpdated: boolean;
}
