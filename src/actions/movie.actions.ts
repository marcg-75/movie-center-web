import { createAction } from 'redux-api-middleware';

import {environment} from '../env/environment';

import MovieModel, {MovieFilter} from '../models/MovieModel';

export const BASE_URL = `${environment.apiBaseUrl}movie`;

export const MOVIES_FETCHING = 'MOVIES_FETCHING';
export const MOVIES_RECEIVED = 'MOVIES_RECEIVED';
export const MOVIES_ERROR = 'MOVIES_ERROR';

export const MOVIE_FETCHING = 'MOVIE_FETCHING';
export const MOVIE_RECEIVED = 'MOVIE_RECEIVED';
export const MOVIE_ERROR = 'MOVIE_ERROR';

export const MOVIE_CREATE_EMPTY = 'MOVIE_CREATE_EMPTY';
export const MOVIE_STATE_CHANGED = 'MOVIE_STATE_CHANGED';

export const MOVIE_CREATING = 'MOVIE_CREATING';
export const MOVIE_CREATED = 'MOVIE_CREATED';
export const MOVIE_CREATE_ERROR = 'MOVIE_CREATE_ERROR';

export const MOVIE_UPDATING = 'MOVIE_UPDATING';
export const MOVIE_UPDATED = 'MOVIE_UPDATED';
export const MOVIE_UPDATE_ERROR = 'MOVIE_UPDATE_ERROR';

export const MOVIE_DELETING = 'MOVIE_DELETING';
export const MOVIE_DELETED = 'MOVIE_DELETED';
export const MOVIE_DELETE_ERROR = 'MOVIE_DELETE_ERROR';

export const MOVIE_FILTER_UPDATED = 'MOVIE_FILTER_UPDATED';
export const MOVIE_FILTER_CLEARED = 'MOVIE_FILTER_CLEARED';

export const CLEAR_MOVIE_ACTION_STATE = 'CLEAR_MOVIE_ACTION_STATE';

export const DEFAULT_FILTER: MovieFilter = {
    title: '',
    mainGenreCode: MovieFilter.FILTER_DEFAULT_ALL_GENRES.code,
    grade: MovieFilter.FILTER_DEFAULT_ALL_GRADES.code,
    freetext: ''
} as MovieFilter;

/** @deprecated  */
export const getAllMovies = (filter: MovieFilter,
                          sortOrder = 'title',
                          sortDir = 'asc') => createAction({
    endpoint: `${BASE_URL}/all${createQueryString(filter, sortOrder, sortDir)}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIES_FETCHING, MOVIES_RECEIVED, MOVIES_ERROR]
});

export const getMovies = (filter: MovieFilter,
                          sortOrder = 'title',
                          sortDir = 'asc',
                          page = 0,
                          pageSize?: number) => createAction({
    endpoint: `${BASE_URL}/list${createQueryString(filter, sortOrder, sortDir, page, pageSize)}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIES_FETCHING, MOVIES_RECEIVED, MOVIES_ERROR]
});

export const getMovieById = (movieId: number) => createAction({
    endpoint: `${BASE_URL}/${movieId}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIE_FETCHING, MOVIE_RECEIVED, MOVIE_ERROR]
});

export const createMovie = (movie: MovieModel) => createAction({
    endpoint: `${BASE_URL}`,
    body: JSON.stringify(transformToOuterModel(movie)),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIE_CREATING, MOVIE_CREATED, MOVIE_CREATE_ERROR]
});

export const updateMovie = (movie: MovieModel) => createAction({
    endpoint: `${BASE_URL}/${movie.id}`,
    body: JSON.stringify(transformToOuterModel(movie)),
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIE_UPDATING, MOVIE_UPDATED, MOVIE_UPDATE_ERROR]
});

//export const updateMovie = (movie: MovieModel, postUpdateAction?: any) => {
//    const updateAction = (movie: MovieModel) => createAction({
//        endpoint: `${BASE_URL}/${movie.id}`,
//        body: JSON.stringify(transformToOuterModel(movie)),
//        method: 'PUT',
//        headers: { 'Content-Type': 'application/json' },
//        types: [MOVIE_UPDATING, MOVIE_UPDATED, MOVIE_UPDATE_ERROR]
//    });
//
//    return (dispatch) => {
//        if (postUpdateAction) {
//            dispatch(updateAction(movie));
//            return dispatch(postUpdateAction());
//        } else {
//            return dispatch(updateAction(movie));
//        }
//    };
//};

export const deleteMovie = (movieId: number) => createAction({
    endpoint: `${BASE_URL}/${movieId}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: [MOVIE_DELETING, MOVIE_DELETED, MOVIE_DELETE_ERROR]
});

export const getEmptyMovie = () => {
    return {
        type: MOVIE_CREATE_EMPTY
    }
};

export const updateMovieState = (movieItem: MovieModel) => {
    return {
        type: MOVIE_STATE_CHANGED,
        movieItem
    }
};

export const updateFilter = (filter: MovieFilter) => {
    return {
        type: MOVIE_FILTER_UPDATED,
        filter
    }
};

export const updateFilterAndReloadMovies = (filter: MovieFilter) => {
    return (dispatch) => {
        dispatch(updateFilter(filter));
        return dispatch(getMovies(filter));
    };
};

export const clearMovieActionState = () => {
    return {
        type: CLEAR_MOVIE_ACTION_STATE
    }
};

export const clearFilter = () => {
    return {
        type: MOVIE_FILTER_CLEARED
    }
};

export const clearFilterAndReloadMovies = () => {
    return (dispatch) => {
        dispatch(clearFilter());
        return dispatch(getMovies(DEFAULT_FILTER));
    };
};

const createQueryString = (filter: MovieFilter,
                           sortOrder: string,
                           sortDir: string,
                           page?: number,
                           pageSize?: number): string => {
    let params: Map<string, string> = new Map();
    let qpString = '';

    if (filter) {

        if (filter.title && filter.title !== '') {
            params = params.set('title', filter.title);
        }

        if (filter.mainGenreCode && filter.mainGenreCode !== MovieFilter.FILTER_DEFAULT_ALL_GENRES.code) {
            params = params.set('mainGenre', filter.mainGenreCode);
        }

        if (filter.formatCode && filter.formatCode !== MovieFilter.FILTER_DEFAULT_ALL_FORMATS.code) {
            params = params.set('format', filter.formatCode);
        }

        if (filter.grade && filter.grade !== MovieFilter.FILTER_DEFAULT_ALL_GRADES.code) {
            params = params.set('grade', '' + filter.grade);
        }

        if (filter.freetext && filter.freetext !== '') {
            params = params.set('q', filter.freetext);
        }
    }

    params = addPageParams(params, sortOrder, sortDir, page, pageSize);

    const iter = params.entries();
    let qp = iter.next();
    while (qp && qp.value) {
        const entry = qp.value;
        qpString = `${qpString}${entry[0]}=${entry[1]}&`;
        qp = iter.next();
    }

    return qpString.length ? `?${qpString.substring(0, qpString.length-1)}` : '';
};

const addPageParams = (params: Map<string, string>, sortOrder: string, sortDir: string, page?: number, pageSize?: number): Map<string, string> => {
    if (page || page === 0) {
        params = params.set('page', '' + page);
    }
    if (pageSize) {
        params = params.set('size', '' + pageSize);
    }
    if (sortOrder && sortDir) {
        params = params.set('sort', sortOrder + ',' + sortDir);
    }
    return params;
};

const transformToOuterModel = (movie: MovieModel): MovieModel => {
    const runtime = movie.runtime;

    if (runtime) {
        //movie.runtime = runtime.substring(11, 16);
        movie.runtime = runtime.substring(runtime.lastIndexOf('T') + 1, runtime.length) + ':00';
    }
    return movie;
};
