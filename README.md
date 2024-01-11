# MovieDetailsComponent Center - Web

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Start the app

There are currently two apps in this monorepo:

- movie-center-web (next.js- and react-query based, currently work-in-progress and far from complete)
  - To start the development server run `nx serve movie-center-web`. Open your browser and navigate to http://localhost:4200/.
- movie-center-web-redux (the old Redux- and react-router based app. Fully functional, but quite crude and not complete)
  - To start the development server run `nx serve movie-center-web-redux`. Open your browser and navigate to http://localhost:4300/.

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Krav

- Create a Next.js app that uses the same presentational components as the Redux based app.
  - Use `ReactQuery`.
  - Use `Emotion/Tailwind`.
  - Use `Material UI` components where it makes sense. Use MUI for the dialogs too, if possible.
  - Use `react-hook-form` for the movie details form (will force the Redux based app to use the same).
- Admin flows:
  - Add studios. New endpoint required.
  - Add languages. New endpoint required.
- Error handling.
- Möjlighet att ladda upp bild-filer för omslagsbilder.
- Hämta filmdata från OMDB (eller andra källor):
  o URL och API (inkl. ev. nyckel)
  o Mappning extern modell till intern modell.
  o Anropa BE för att skapa / uppdatera filmdata.
- Kolla kvarvarande TODO-punkter i FE & BE.
- Städa och optimera kod
- Skriv tester (frontend & backend)

### UX

- Bestäm färgprofil
- Ta fram designskisser på de olika vyerna (allt eftersom)

## Buggar

- UI
  - Filter component responsiveness.

## Restlista

- Add actor: Se till att en personRole som redan är vald inte kan väljas. (Just nu: Dubletten ignoreras vid spara.)
- Add new actor: Eget flöde för att lägga till (sökdialog där både ny och befintlig person hanteras). Förhindra att det skapas person-dubbletter i person-db-tabellen.
- Add new crew member: Eget flöde för att lägga till (sökdialog där både ny och befintlig person hanteras). Förhindra att det skapas person-dubbletter i person-db-tabellen.
- Introducera GraphQL & Aurora.
- Admin-vy med bl.a. möjlighet att redigera (lägga till och ta bort) språk.
- Sök-funktion för omslagsbilder till en film (Googles sök-API?)
