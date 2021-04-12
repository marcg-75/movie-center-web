import {
    CACHE_KEYS,
    GENRES_FETCHING, GENRES_RECEIVED, GENRES_RECEIVE_ERROR,
    ROLES_FETCHING, ROLES_RECEIVED, ROLES_RECEIVE_ERROR,
    FORMATS_FETCHING, FORMATS_RECEIVED, FORMATS_RECEIVE_ERROR,
    STUDIOS_FETCHING, STUDIOS_RECEIVED, STUDIOS_RECEIVE_ERROR,
    LANGUAGES_FETCHING, LANGUAGES_RECEIVED, LANGUAGES_RECEIVE_ERROR
} from './base-data.actions';
import {setStoredData} from '../utils/storageUtils';

export default function baseDataReducer(state = {
    genresLoaded: false,
    rolesLoaded: false,
    formatsLoaded: false,
    studiosLoaded: false,
    languagesLoaded: false
}, {
    type,
    payload
    }) {
    switch (type) {
        case GENRES_FETCHING:
            return {
                ...state,
                genresLoaded: false
            };
        case GENRES_RECEIVED:
            // Cache data.
            setStoredData(CACHE_KEYS.GENRES, payload);

            return {
                ...state,
                genres: payload,
                genresLoaded: true
            };
        case GENRES_RECEIVE_ERROR:
            let errMsgGenre = payload.response ? payload.response.error : payload.message;
            //parseError(error);  // TODO: Implementera felhantering

            console.error(errMsgGenre);

            //log.error(err.message, err.stacktrace);
            // catchError(handleErrorUtil('BaseDataService.loadGenres', []))

            return {
                ...state,
                genresErrorMessage: errMsgGenre,  // TODO: Expose
                genres: undefined,
                genresLoaded: true
            };
        case ROLES_FETCHING:
            return {
                ...state,
                rolesLoaded: false
            };
        case ROLES_RECEIVED:
            // Cache data.
            setStoredData(CACHE_KEYS.ROLES, payload);

            return {
                ...state,
                roles: payload,
                rolesLoaded: true
            };
        case ROLES_RECEIVE_ERROR:
            let errMsgRole = payload.response ? payload.response.error : payload.message;
            //parseError(error);  // TODO: Implementera felhantering
            console.error(errMsgRole);

            //log.error(err.message, err.stacktrace);
            // catchError(handleErrorUtil('BaseDataService.loadRoles', []))

            return {
                ...state,
                rolesErrorMessage: errMsgRole,  // TODO: Expose
                roles: undefined,
                rolesLoaded: true
            };
        case FORMATS_FETCHING:
            return {
                ...state,
                formatsLoaded: false
            };
        case FORMATS_RECEIVED:
            // Cache data.
            setStoredData(CACHE_KEYS.FORMATS, payload);

            return {
                ...state,
                formats: payload,
                formatsLoaded: true
            };
        case FORMATS_RECEIVE_ERROR:
            let errMsgFormat = payload.response ? payload.response.error : payload.message;
            //parseError(error);  // TODO: Implementera felhantering
            console.error(errMsgFormat);

            //log.error(err.message, err.stacktrace);
            // catchError(handleErrorUtil('BaseDataService.loadFormats', []))

            return {
                ...state,
                formatsErrorMessage: errMsgFormat,  // TODO: Expose
                formats: [],
                formatsLoaded: true
            };
        case STUDIOS_FETCHING:
            return {
                ...state,
                studiosLoaded: false
            };
        case STUDIOS_RECEIVED:
            return {
                ...state,
                studios: payload,
                studiosLoaded: true
            };
        case STUDIOS_RECEIVE_ERROR:
            let errMsgStudio = payload.response ? payload.response.error : payload.message;
            //parseError(error);  // TODO: Implementera felhantering
            console.error(errMsgStudio);

            //log.error(err.message, err.stacktrace);
            // catchError(handleErrorUtil('BaseDataService.loadStudios', []))

            return {
                ...state,
                studiosErrorMessage: errMsgStudio,  // TODO: Expose
                studios: [],
                studiosLoaded: true
            };
        case LANGUAGES_FETCHING:
            return {
                ...state,
                languagesLoaded: false
            };
        case LANGUAGES_RECEIVED:
            return {
                ...state,
                languages: payload,
                languagesLoaded: true
            };
        case LANGUAGES_RECEIVE_ERROR:
            let errMsgLang = payload.response ? payload.response.error : payload.message;
            //parseError(error);  // TODO: Implementera felhantering
            console.error(errMsgLang);

            //log.error(err.message, err.stacktrace);
            // catchError(handleErrorUtil('BaseDataService.loadStudios', []))

            return {
                ...state,
                languagesErrorMessage: errMsgLang,  // TODO: Expose
                languages: [],
                languagesLoaded: true
            };
        default:
            return state;
    }
}

