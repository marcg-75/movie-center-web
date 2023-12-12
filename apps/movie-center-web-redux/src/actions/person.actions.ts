import { createAction } from 'redux-api-middleware';

import { environment } from '../env/environment';

export const ACTORS_FETCHING = 'ACTORS_FETCHING';
export const ACTORS_RECEIVED = 'ACTORS_RECEIVED';
export const ACTORS_ERROR = 'ACTORS_ERROR';

export const CREW_FETCHING = 'CREW_FETCHING';
export const CREW_RECEIVED = 'CREW_RECEIVED';
export const CREW_ERROR = 'CREW_ERROR';

export const ALL_PERSONS_FETCHING = 'ALL_PERSONS_FETCHING';
export const ALL_PERSONS_RECEIVED = 'ALL_PERSONS_RECEIVED';
export const ALL_PERSONS_ERROR = 'ALL_PERSONS_ERROR';

export const BASE_URL = `${environment.apiBaseUrl}person`;

export const getActors = () =>
  createAction({
    endpoint: `${BASE_URL}/actors`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [ACTORS_FETCHING, ACTORS_RECEIVED, ACTORS_ERROR],
  });

export const getCrew = () =>
  createAction({
    endpoint: `${BASE_URL}/crew`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [CREW_FETCHING, CREW_RECEIVED, CREW_ERROR],
  });

export const getAllPersons = () =>
  createAction({
    endpoint: `${BASE_URL}/all`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [ALL_PERSONS_FETCHING, ALL_PERSONS_RECEIVED, ALL_PERSONS_ERROR],
  });
