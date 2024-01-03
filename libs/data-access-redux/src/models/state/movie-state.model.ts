import { IMovie } from '../../../../shared/models/src/movie.model';
import { LoadingState } from './loading.model';
import { MovieFilter } from '@giron/shared-models';

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
