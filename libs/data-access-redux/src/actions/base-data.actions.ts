import { createAction } from 'redux-api-middleware';
//import webApi from '../utils/webApi';
import { getStoredData } from '../utils/storageUtils';

export const CACHE_KEYS = {
  GENRES: 'GENRES',
  ROLES: 'ROLES',
  FORMATS: 'FORMATS',
};

export const GENRES_FETCHING = 'GENRES_FETCHING';
export const GENRES_RECEIVED = 'GENRES_RECEIVED';
export const GENRES_RECEIVE_ERROR = 'GENRES_RECEIVE_ERROR';

export const ROLES_FETCHING = 'ROLES_FETCHING';
export const ROLES_RECEIVED = 'ROLES_RECEIVED';
export const ROLES_RECEIVE_ERROR = 'ROLES_RECEIVE_ERROR';

export const FORMATS_FETCHING = 'FORMATS_FETCHING';
export const FORMATS_RECEIVED = 'FORMATS_RECEIVED';
export const FORMATS_RECEIVE_ERROR = 'FORMATS_RECEIVE_ERROR';

export const STUDIOS_FETCHING = 'STUDIOS_FETCHING';
export const STUDIOS_RECEIVED = 'STUDIOS_RECEIVED';
export const STUDIOS_RECEIVE_ERROR = 'STUDIOS_RECEIVE_ERROR';

export const LANGUAGES_FETCHING = 'LANGUAGES_FETCHING';
export const LANGUAGES_RECEIVED = 'LANGUAGES_RECEIVED';
export const LANGUAGES_RECEIVE_ERROR = 'LANGUAGES_RECEIVE_ERROR';

const BASE_URL = `${process.env.NX_API_BASE_URL}base`;

export const loadGenres = () => {
  // Look in cache.
  const cachedData = getStoredData(CACHE_KEYS.GENRES, true);

  if (cachedData) {
    return {
      type: GENRES_RECEIVED,
      payload: cachedData,
    };
  }

  return createAction({
    endpoint: `${BASE_URL}/genres`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    types: [GENRES_FETCHING, GENRES_RECEIVED, GENRES_RECEIVE_ERROR],
  });
};

export const loadRoles = () => {
  // Look in cache.
  const cachedData = getStoredData(CACHE_KEYS.ROLES, true);

  if (cachedData) {
    return {
      type: ROLES_RECEIVED,
      payload: cachedData,
    };
  }

  return createAction({
    endpoint: `${BASE_URL}/roles`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [ROLES_FETCHING, ROLES_RECEIVED, ROLES_RECEIVE_ERROR],
  });
};

export const loadFormats = () => {
  // Look in cache.
  const cachedData = getStoredData(CACHE_KEYS.FORMATS, true);

  if (cachedData) {
    return {
      type: FORMATS_RECEIVED,
      payload: cachedData,
    };
  }

  return createAction({
    endpoint: `${BASE_URL}/formats`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [FORMATS_FETCHING, FORMATS_RECEIVED, FORMATS_RECEIVE_ERROR],
  });
};

export const loadStudios = () =>
  createAction({
    endpoint: `${BASE_URL}/studios`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [STUDIOS_FETCHING, STUDIOS_RECEIVED, STUDIOS_RECEIVE_ERROR],
  });

export const loadLanguages = () =>
  createAction({
    endpoint: `${BASE_URL}/languages`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [LANGUAGES_FETCHING, LANGUAGES_RECEIVED, LANGUAGES_RECEIVE_ERROR],
  });
