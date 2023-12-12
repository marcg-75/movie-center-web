import { IMovie, MovieFilter } from '../models/movie.model';
import { MovieListStateModel } from './models/movie-state.model';
import {
  DEFAULT_FILTER,
  MOVIE_FILTER_CLEARED,
  MOVIE_FILTER_UPDATED,
  MOVIES_ERROR,
  MOVIES_FETCHING,
  MOVIES_RECEIVED,
} from './movie.actions';
import { createErrorMessageArray } from './movie.reducer';

interface MovieListActionProps {
  type: string;
  payload: MovieListPayload;
  filter: MovieFilter;
}

interface MovieListPayload {
  content: IMovie | IMovie[];
  status: number;
  message: string;
  response?: {
    errors?: Error[];
    error?: Error;
  };
}

export const movieListReducer = (
  state: MovieListStateModel = {
    moviesNotLoaded: true,
    filter: DEFAULT_FILTER,
  },
  { type, payload, filter }: MovieListActionProps
) => {
  switch (type) {
    case MOVIES_FETCHING:
      return {
        ...state,
        moviesNotLoaded: true,
        movieListErrorMessages: undefined,
      };
    case MOVIES_RECEIVED:
      return {
        ...state,
        movies: payload.content,
        moviesNotLoaded: false,
        movieListErrorMessages: undefined,
      };
    case MOVIES_ERROR:
      const movieListErrorMessages = createErrorMessageArray(payload);

      //if (payload.status && payload.status === 401 && !state.logoutIniated) {  // TODO: Borde hanteras med en generell interceptor i stället. Finns det stöd för det i redux-api-middleware?
      //    state.logoutIniated = true;
      //this.router.navigate(['start', { canDeactivate: true }], { queryParams: { redirectToUrl: encodeURI(this.router.url) } });
      //}
      //parseError(error);  // TODO: Implementera felhantering
      //log.error(err.message, err.stacktrace);
      //catchError(handleErrorUtil('AuthorityService.getAuthorities', {content: []} as Pageable<AuthorityModel>)))
      //DialogComponent.openDefaultErrorDialog(this.dialog, err);

      return {
        ...state,
        movieListErrorMessages: movieListErrorMessages,
        movies: [],
        moviesNotLoaded: false,
      };
    case MOVIE_FILTER_UPDATED:
      return {
        ...state,
        filter,
      };
    case MOVIE_FILTER_CLEARED:
      return {
        ...state,
        filter: DEFAULT_FILTER,
      };
    default:
      return state;
  }
};
