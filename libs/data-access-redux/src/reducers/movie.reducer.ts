import { default as moment } from 'moment';

import {
  CLEAR_MOVIE_ACTION_STATE,
  MOVIE_CREATE_EMPTY,
  MOVIE_CREATE_ERROR,
  MOVIE_CREATED,
  MOVIE_CREATING,
  MOVIE_DELETE_ERROR,
  MOVIE_DELETED,
  MOVIE_DELETING,
  MOVIE_ERROR,
  MOVIE_FETCHING,
  MOVIE_RECEIVED,
  MOVIE_STATE_CHANGED,
  MOVIE_UPDATE_ERROR,
  MOVIE_UPDATED,
  MOVIE_UPDATING,
} from '../actions/movie.actions';
import { IMovie, SelectableModel } from '@giron/shared-models';
import { MovieStateModel } from '../models/state/movie-state.model';
import {
  getFailedLoadingState,
  initialLoadingState,
  loadingLoadingState,
  successLoadingState,
} from '../models/state/loading.model';

export interface McPayload {
  status?: number;
  message?: string;
  response?: {
    errors?: Error[];
    error?: Error;
  };
}

interface IMoviePayload extends IMovie, McPayload {}

export interface MovieActionProps {
  type: string;
  payload: IMoviePayload;
  movieItem: IMovie;
}

export const movieReducer = (
  state: MovieStateModel = {
    movieLoading: initialLoadingState,
    movieCreated: false,
    movieUpdated: false,
  },
  { type, payload, movieItem }: MovieActionProps
) => {
  switch (type) {
    case MOVIE_FETCHING:
      return {
        ...state,
        movieLoading: loadingLoadingState,
      };
    case MOVIE_RECEIVED:
      return {
        ...state,
        movieItem: transformToInnerModel(payload),
        movieLoading: successLoadingState,
      };
    case MOVIE_ERROR:
      let movieErrorMessages = [];

      if (payload.status === 404) {
        movieErrorMessages.push('Movie not found');
      } else {
        movieErrorMessages = createErrorMessageArray(payload);
      }
      //parseError(error);  // TODO: Implementera felhantering

      // catchError(handleErrorUtil('AuthorityService.getAuthorityById', undefined))

      return {
        ...state,
        movieLoading: getFailedLoadingState(undefined, movieErrorMessages),
        movieNotLoaded: false,
      };
    case MOVIE_CREATE_EMPTY:
      const emptyMovie = createEmptyMovie();

      return {
        ...state,
        movieItem: emptyMovie,
        movieLoading: successLoadingState,
        movieCreated: false,
      };
    case MOVIE_STATE_CHANGED:
      return {
        ...state,
        movieItem,
      };
    case MOVIE_CREATING:
      return {
        ...state,
        movieLoading: loadingLoadingState,
        movieCreated: false,
      };
    case MOVIE_CREATED:
      return {
        ...state,
        movieItem: transformToInnerModel(payload),
        movieLoading: successLoadingState,
        movieCreated: true,
      };
    case MOVIE_CREATE_ERROR:
      // TODO: Implementera felhantering

      return {
        ...state,
        movieLoading: getFailedLoadingState(
          undefined,
          createErrorMessageArray(payload)
        ),
        movieCreated: false,
      };
    case MOVIE_UPDATING:
      return {
        ...state,
        movieLoading: loadingLoadingState,
        movieUpdated: false,
      };
    case MOVIE_UPDATED:
      return {
        ...state,
        movieItem: transformToInnerModel(payload),
        movieLoading: successLoadingState,
        movieUpdated: true,
      };
    case MOVIE_UPDATE_ERROR:
      // TODO: Implementera felhantering
      let updateErrorMessages = [];

      if (payload.status === 404) {
        updateErrorMessages.push('Movie not found');
      } else {
        updateErrorMessages = createErrorMessageArray(payload);
      }

      return {
        ...state,
        movieLoading: getFailedLoadingState(undefined, updateErrorMessages),
        movieUpdated: false,
      };
    case MOVIE_DELETING:
      return {
        ...state,
        movieLoading: loadingLoadingState,
      };
    case MOVIE_DELETED:
      return {
        ...state,
        movieItem: undefined,
        movieLoading: successLoadingState,
      };
    case MOVIE_DELETE_ERROR:
      // TODO: Implementera felhantering
      let deleteErrorMessages = [];

      if (payload.status === 404) {
        deleteErrorMessages.push('Movie not found');
      } else {
        deleteErrorMessages = createErrorMessageArray(payload);
      }

      return {
        ...state,
        movieLoading: getFailedLoadingState(undefined, deleteErrorMessages),
      };
    case CLEAR_MOVIE_ACTION_STATE:
      return {
        ...state,
        movieLoading: initialLoadingState,
        movieCreated: false,
        movieUpdated: false,
      };
    default:
      return state;
  }
};

const createEmptyMovie = () => {
  return {
    title: '',
  } as IMovie;
};

export const createErrorMessageArray = (payload: McPayload): string[] => {
  const errorMessages: string[] = [];

  if (payload.response && payload.response.errors) {
    payload.response.errors.forEach((err) => {
      errorMessages.push(err.message);
    });
  } else if (payload.response && payload.response.error) {
    errorMessages.push(payload.response.error.message);
  } else if (payload.message) {
    errorMessages.push(payload.message);
  }

  return errorMessages;
};

const transformToInnerModel = (movieItem: IMovie): IMovie => {
  const { runtime, releaseDate } = movieItem;
  const { movieFormatInfo, moviePersonalInfo } = movieItem;
  const { obtainDate } = moviePersonalInfo;

  return {
    ...movieItem,
    runtime: runtime ? '2020-01-01T' + runtime.substring(0, 5) : undefined,
    releaseDate: releaseDate
      ? moment(releaseDate).format('YYYY-MM-DD')
      : undefined,
    movieFormatInfo: {
      ...movieFormatInfo,
      format: movieFormatInfo.format
        ? movieFormatInfo.format
        : ({} as SelectableModel),
    },
    moviePersonalInfo: {
      ...moviePersonalInfo,
      obtainDate: obtainDate
        ? moment(obtainDate).format('YYYY-MM-DD')
        : undefined,
    },
  };
};
