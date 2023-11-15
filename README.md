# Work in progress...

## Krav
- Migrera till React 18, hooks och annat som görs i RV, React Query (och Redux (konfigurerbar switch mellan dessa)), Tailwind
- Introducera Next.js a'la RV och ta bort react-scripts och react router.
- Migrera till Tailwind.
v Lägg till helt nya personer (cast & crew). Separat flöde? Ska också kunna välja befintliga personer t.ex. när skådespelare ska läggas till.
v Ta bort cast & crew från en film
v Redigering av crew (alla roller)
v Redigering av format-info
- Möjlighet att ladda upp bild-filer för omslagsbilder.
v Redigering av personlig info
v Backend: Adapter för inläsning av XML-fil(er) från DVD-profiler (triggas manuellt)
- Hämta filmdata från OMDB (eller andra källor):
    o URL och API (inkl. ev. nyckel)
    o Mappning extern modell till intern modell.
    o Anropa BE för att skapa / uppdatera filmdata.
- Styling (Tailwind eller styled-components)
- Bootstrap-dialog (plus ev . andra saker från Bootstrap)
- Felhantering i reducers, bl.a, inkl. FE-loggning till BE.
- Kolla kvarvarande TODO-punkter i FE & BE.
- Gör om sub-panelkomponenterna till "self invoking functions" istf React-komponenter.
- Städa och optimera kod
v Bestäm vilket språk som ska användas i GUI och inför detta
- Skriv tester (frontend & backend)

### UX
- Bestäm färgprofil
- Ta fram designskisser på de olika vyerna (allt eftersom)

## Buggar

## Restlista
- Add actor: Se till att en personRole som redan är vald inte kan väljas. (Just nu: Dubletten ignoreras vid spara.)
- Add new actor: Eget flöde för att lägga till (sökdialog där både ny och befintlig person hanteras). Förhindra att det skapas person-dubbletter i person-db-tabellen.
- Add new crew member: Eget flöde för att lägga till (sökdialog där både ny och befintlig person hanteras). Förhindra att det skapas person-dubbletter i person-db-tabellen.
- Introducera GraphQL & Aurora.
- Admin-vy med bl.a. möjlighet att redigera (lägga till och ta bort) språk.
- Sök-funktion för omslagsbilder till en film (Googles sök-API?)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
