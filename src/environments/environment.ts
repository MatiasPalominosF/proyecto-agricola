// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// WARNING - Values under "firebase" and value of "googleApiKey" needs to be replaced from your own accounts
// If left as is, it firbase and google map related functionality will not work on LIVE instance.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDYPvQX7QCWPnXp-F-RXApE3Z29MmcatwA",
    authDomain: "costafrut-app.firebaseapp.com",
    databaseURL: "https://costafrut-app.firebaseio.com",
    projectId: "costafrut-app",
    storageBucket: "costafrut-app.appspot.com",
    messagingSenderId: "283307742272",
    appId: "1:283307742272:web:04093b099195d23f323ba5",
    measurementId: "G-EJLZKRWHEK"

  },
  googleApiKey: 'AIzaSyAIIYOxA7qeetFz6TuR1Qewc0Rrjhzx7ZU'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
