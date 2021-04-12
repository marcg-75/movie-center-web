// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:8080/api/',

    cacheStorageDefault: 'SESSION',  // ...or LOCAL
    cacheExpTimeMinutes: 10,

    // Popup an alert-dialog before sending the frontend-log to backend.
    errorLogAsAlert: false,

    // Feature toggles

    enableMovieInfoEdit: true,
    enableMovieFormatEdit: true,
    enableSaveMovieFilter: true
};
