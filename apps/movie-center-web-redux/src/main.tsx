import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
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

const { store, persistor } = configureStore();

//errorLogger();

//store.dispatch(loadAllRbcs());
//store.dispatch(loadUserInfo());

//injectGlobal`${theme.skins.Global(theme, process.env.NODE_ENV)}`; // eslint-disable-line no-unused-expressions

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
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
    </PersistGate>
  </Provider>
);

// root.render(
//     <React.StrictMode>
//         {/*<ThemeProvider theme={theme}>*/}
//         <Provider store={store}>
//             <PersistGate loading={null} persistor={persistor}>
//                 <Router>
//                     <App>
//                         <Switch>
//                             {routes.map((route, i) => (
//                                 <Route path={route.path} component={route.component} key={i} />
//                             ))}
//                         </Switch>
//                     </App>
//                 </Router>
//             </PersistGate>
//         </Provider>,
//         {/*</ThemeProvider>*/}
//     </React.StrictMode>
// );
