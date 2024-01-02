import { IMovie } from '../movie.model';
import { LoadingState } from './loading.model';
import { MovieFilter } from '../../../../feature-movie-list-redux/src/lib/models/MovieFilter';

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
