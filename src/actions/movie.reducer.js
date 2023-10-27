import * as moment from 'moment';

import {
    MOVIES_FETCHING, MOVIES_RECEIVED, MOVIES_ERROR,
    MOVIE_FETCHING, MOVIE_RECEIVED, MOVIE_ERROR,
    MOVIE_FILTER_UPDATED, MOVIE_FILTER_CLEARED,
    MOVIE_CREATE_EMPTY,
    MOVIE_STATE_CHANGED,
    MOVIE_CREATING, MOVIE_CREATED, MOVIE_CREATE_ERROR,
    MOVIE_UPDATING, MOVIE_UPDATED, MOVIE_UPDATE_ERROR,
    MOVIE_DELETING, MOVIE_DELETED, MOVIE_DELETE_ERROR,
    CLEAR_MOVIE_ACTION_STATE,
    DEFAULT_FILTER
} from './movie.actions';
import MovieModel from '../models/MovieModel';
import SelectableModel from '../models/SelectableModel';

export default function movieReducer(state = {
    moviesNotLoaded: true,
    movieNotLoaded: true,
    movieCreated: false,
    movieUpdated: false,
    filter: DEFAULT_FILTER
}, {
    type,
    payload,
    movieItem,
    filter
    }) {
    switch (type) {
        case MOVIES_FETCHING:
            return {
                ...state,
                moviesNotLoaded: true,
                movieListErrorMessages: undefined
            };
        case MOVIES_RECEIVED:
            return {
                ...state,
                movies: payload.content,
                moviesNotLoaded: false,
                movieListErrorMessages: undefined
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
                moviesNotLoaded: false
            };
        case MOVIE_FETCHING:
            return {
                ...state,
                movieNotLoaded: true,
                movieErrorMessages: undefined
            };
        case MOVIE_RECEIVED:
            return {
                ...state,
                movieItem: transformToInnerModel(payload),
                movieNotLoaded: false,
                movieErrorMessages: undefined
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
                movieErrorMessages,
                movieNotLoaded: false
            };
        case MOVIE_CREATE_EMPTY:
            const emptyMovie = createEmptyMovie();

            return {
                ...state,
                movieItem: emptyMovie,
                movieNotLoaded: false,
                movieErrorMessages: undefined,
                movieCreated: false
            };
        case MOVIE_STATE_CHANGED:
            return {
                ...state,
                movieItem,
                movieErrorMessages: undefined
            };
        case MOVIE_CREATING:
            return {
                ...state,
                movieCreating: true,
                movieCreated: false,
                movieErrorMessages: undefined
            };
        case MOVIE_CREATED:
            return {
                ...state,
                movieItem: transformToInnerModel(payload),
                movieCreating: false,
                movieCreated: true,
                movieErrorMessages: undefined
            };
        case MOVIE_CREATE_ERROR:
            // TODO: Implementera felhantering
            const createErrorMessages = createErrorMessageArray(payload);

            return {
                ...state,
                movieErrorMessages: createErrorMessages,
                movieCreating: false,
                movieCreated: false
            };
        case MOVIE_UPDATING:
            return {
                ...state,
                movieUpdating: true,
                movieUpdated: false,
                movieErrorMessages: undefined
            };
        case MOVIE_UPDATED:
            return {
                ...state,
                movieItem: transformToInnerModel(payload),
                movieErrorMessages: undefined,
                movieUpdated: true,
                movieUpdating: false
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
                movieErrorMessages: updateErrorMessages,
                movieUpdating: false,
                movieUpdated: false
            };
        case MOVIE_DELETING:
            return {
                ...state,
                movieDeleting: true,
                movieDeleted: false,
                movieErrorMessages: undefined
            };
        case MOVIE_DELETED:
            return {
                ...state,
                movieItem: undefined,
                movieErrorMessages: undefined,
                movieDeleting: false,
                movieDeleted: true
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
                movieErrorMessages: deleteErrorMessages,
                movieDeleting: false
            };
        case CLEAR_MOVIE_ACTION_STATE:
            return {
                ...state,
                movieCreating: false,
                movieCreated: false,
                movieUpdating: false,
                movieUpdated: false,
                movieDeleting: false,
                movieDeleted: false
            };
        case MOVIE_FILTER_UPDATED:
            return {
                ...state,
                filter
            };
        case MOVIE_FILTER_CLEARED:
            return {
                ...state,
                filter: DEFAULT_FILTER
            };
        default:
            return state;
    }
}

const createEmptyMovie = () => {
    const movie = new MovieModel();

    movie.title = '';
    // TODO: continue...

    return movie;
};

export const createErrorMessageArray = (payload) => {
    const errorMessages = [];

    if (payload.response && payload.response.errors) {
        payload.response.errors.forEach(err => {
            errorMessages.push(err.defaultMessage);
        });
    } else {
        errorMessages.push(payload.response ? payload.response.error : payload.message);
    }

    return errorMessages;
};

const transformToInnerModel = (movieItem) => {
    const {runtime, releaseDate} = movieItem;
    const {movieFormatInfo, moviePersonalInfo} = movieItem;
    const {obtainDate} = moviePersonalInfo;

    return {
        ...movieItem,
        runtime: runtime ? '2020-01-01T' + runtime.substring(0, 5) : undefined,
        releaseDate: releaseDate ? moment(releaseDate).format('YYYY-MM-DD') : undefined,
        movieFormatInfo: {
            ...movieFormatInfo,
            format: movieFormatInfo.format ? movieFormatInfo.format : new SelectableModel()
        },
        moviePersonalInfo: {
            ...moviePersonalInfo,
            obtainDate: obtainDate ? moment(obtainDate).format('YYYY-MM-DD') : undefined
        }
    }
};
