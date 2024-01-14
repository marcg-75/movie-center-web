import '@giron/shared-ui-library/variables.css';
import '@giron/shared-ui-library/styles.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from './components/App';
import MovieList from '@giron/feature-movie-list-redux';
import Movie from '@giron/feature-movie-redux';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

// TODO: Currently not in use. Possibly a move to Next.js is required.

const routes = [
  { path: '/movies', component: MovieList },
  { path: '/movie/:id', component: Movie },
  //{ path: '', redirectTo: 'movie', pathMatch: 'full' }
  { path: '', component: MovieList },
];

const { store /*, persistor*/ } = configureStore();

//errorLogger();

//injectGlobal`${theme.skins.Global(theme, process.env.NODE_ENV)}`; // eslint-disable-line no-unused-expressions

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    {/*PersistGate commented out since persisting data leads to exceeded storage quota in this app*/}
    {/*<PersistGate loading={null} persistor={persistor}>*/}
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <App>
          <Switch>
            {routes.map((route, i) => (
              <Route path={route.path} component={route.component} key={i} />
            ))}
          </Switch>
        </App>
      </Router>
    </LocalizationProvider>
    {/*</PersistGate>*/}
  </Provider>
);
