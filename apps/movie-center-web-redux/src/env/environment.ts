// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { STORAGE_TYPE } from '../models/storage.model';

export interface Environment {
  production: boolean;
  apiBaseUrl: string;

  cacheStorageDefault: STORAGE_TYPE;
  cacheExpTimeMinutes: number;

  // Popup an alert-dialog before sending the frontend-log to backend.
  errorLogAsAlert: boolean;

  // Feature toggles

  enableMovieInfoEdit: boolean;
  enableMovieFormatEdit: boolean;
  enableSaveMovieFilter: boolean;
}

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/',

  cacheStorageDefault: STORAGE_TYPE.SESSION, // ...or LOCAL
  cacheExpTimeMinutes: 10,

  // Popup an alert-dialog before sending the frontend-log to backend.
  errorLogAsAlert: false,

  // Feature toggles

  enableMovieInfoEdit: true,
  enableMovieFormatEdit: true,
  enableSaveMovieFilter: true,
};
