import {
  CACHE_KEYS,
  FORMATS_FETCHING,
  FORMATS_RECEIVE_ERROR,
  FORMATS_RECEIVED,
  GENRES_FETCHING,
  GENRES_RECEIVE_ERROR,
  GENRES_RECEIVED,
  LANGUAGES_FETCHING,
  LANGUAGES_RECEIVE_ERROR,
  LANGUAGES_RECEIVED,
  ROLES_FETCHING,
  ROLES_RECEIVE_ERROR,
  ROLES_RECEIVED,
  STUDIOS_FETCHING,
  STUDIOS_RECEIVE_ERROR,
  STUDIOS_RECEIVED,
} from './base-data.actions';
import { setStoredData } from '../utils/storageUtils';
import { McPayload } from './movie.reducer';
import { BaseDataStateModel } from './models/base-data-state.model';
import {
  getFailedLoadingState,
  initialLoadingState,
  loadingLoadingState,
  successLoadingState,
} from './models/loading.model';

interface BaseDataActionProps {
  type: string;
  payload: Object | McPayload;
}

export default function baseDataReducer(
  state: BaseDataStateModel = {
    genresLoading: initialLoadingState,
    rolesLoading: initialLoadingState,
    formatsLoading: initialLoadingState,
    studiosLoading: initialLoadingState,
    languagesLoading: initialLoadingState,
    genresLoaded: false,
    rolesLoaded: false,
    formatsLoaded: false,
    studiosLoaded: false,
    languagesLoaded: false,
  },
  { type, payload }: BaseDataActionProps
) {
  switch (type) {
    case GENRES_FETCHING:
      return {
        ...state,
        genresLoading: loadingLoadingState,
        genresLoaded: false,
      };
    case GENRES_RECEIVED:
      // Cache data.
      setStoredData(CACHE_KEYS.GENRES, payload);

      return {
        ...state,
        genres: payload,
        genresLoading: successLoadingState,
        genresLoaded: true,
      };
    case GENRES_RECEIVE_ERROR:
      const plg = payload as McPayload;
      let errMsgGenre = plg.response ? plg.response.error : plg.message;
      //parseError(error);  // TODO: Implementera felhantering

      console.error(errMsgGenre);

      //log.error(err.message, err.stacktrace);
      // catchError(handleErrorUtil('BaseDataService.loadGenres', []))

      return {
        ...state,
        genres: undefined,
        genresLoading: getFailedLoadingState(errMsgGenre),
        genresLoaded: true,
      };
    case ROLES_FETCHING:
      return {
        ...state,
        rolesLoading: loadingLoadingState,
        rolesLoaded: false,
      };
    case ROLES_RECEIVED:
      // Cache data.
      setStoredData(CACHE_KEYS.ROLES, payload);

      return {
        ...state,
        roles: payload,
        rolesLoading: successLoadingState,
        rolesLoaded: true,
      };
    case ROLES_RECEIVE_ERROR:
      const pl = payload as McPayload;
      let errMsgRole = pl.response ? pl.response.error : pl.message;
      //parseError(error);  // TODO: Implementera felhantering
      console.error(errMsgRole);

      //log.error(err.message, err.stacktrace);
      // catchError(handleErrorUtil('BaseDataService.loadRoles', []))

      return {
        ...state,
        roles: undefined,
        rolesLoading: getFailedLoadingState(errMsgRole),
        rolesLoaded: true,
      };
    case FORMATS_FETCHING:
      return {
        ...state,
        formatsLoading: loadingLoadingState,
        formatsLoaded: false,
      };
    case FORMATS_RECEIVED:
      // Cache data.
      setStoredData(CACHE_KEYS.FORMATS, payload);

      return {
        ...state,
        formats: payload,
        formatsLoading: successLoadingState,
        formatsLoaded: true,
      };
    case FORMATS_RECEIVE_ERROR:
      const plf = payload as McPayload;
      let errMsgFormat = plf.response ? plf.response.error : plf.message;
      //parseError(error);  // TODO: Implementera felhantering
      console.error(errMsgFormat);

      //log.error(err.message, err.stacktrace);
      // catchError(handleErrorUtil('BaseDataService.loadFormats', []))

      return {
        ...state,
        formats: [],
        formatsLoading: getFailedLoadingState(errMsgFormat),
        formatsLoaded: true,
      };
    case STUDIOS_FETCHING:
      return {
        ...state,
        studiosLoading: loadingLoadingState,
        studiosLoaded: false,
      };
    case STUDIOS_RECEIVED:
      return {
        ...state,
        studios: payload,
        studiosLoading: successLoadingState,
        studiosLoaded: true,
      };
    case STUDIOS_RECEIVE_ERROR:
      const pls = payload as McPayload;
      let errMsgStudio = pls.response ? pls.response.error : pls.message;
      //parseError(error);  // TODO: Implementera felhantering
      console.error(errMsgStudio);

      //log.error(err.message, err.stacktrace);
      // catchError(handleErrorUtil('BaseDataService.loadStudios', []))

      return {
        ...state,
        studios: [],
        studiosLoading: getFailedLoadingState(errMsgStudio),
        studiosLoaded: true,
      };
    case LANGUAGES_FETCHING:
      return {
        ...state,
        languagesLoading: loadingLoadingState,
        languagesLoaded: false,
      };
    case LANGUAGES_RECEIVED:
      return {
        ...state,
        languages: payload,
        languagesLoading: successLoadingState,
        languagesLoaded: true,
      };
    case LANGUAGES_RECEIVE_ERROR:
      const pll = payload as McPayload;
      let errMsgLang = pll.response ? pll.response.error : pll.message;
      //parseError(error);  // TODO: Implementera felhantering
      console.error(errMsgLang);

      //log.error(err.message, err.stacktrace);
      // catchError(handleErrorUtil('BaseDataService.loadStudios', []))

      return {
        ...state,
        languages: [],
        languagesLoading: getFailedLoadingState(errMsgLang),
        languagesLoaded: true,
      };
    default:
      return state;
  }
}
