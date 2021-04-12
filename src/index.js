import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

//import './style.scss';
//import * as serviceWorker from './serviceWorker';

import configureStore from './store';

//import {loadUserInfo} from './actions/auth.actions';
//import {loadAllRbcs} from './actions/base-data.actions';

import App from './components/App';
//import StartPage from './components/start-page/StartPage';
//import LogoutPage from './components/logout-page/LogoutPage';
//import SetUser from './components/set-user/SetUser';
//import MainPage from './components/main-page/MainPage';
import MovieList from './components/movie-list/MovieList';
import Movie from './components/movie/Movie';
//import AuthorityForm from './components/authority-form/AuthorityForm';

const routes = [
    { path: '/movies', component: MovieList },
    { path: '/movie/:id', component: Movie },
    //{ path: '', redirectTo: 'movie', pathMatch: 'full' }
    { path: '', component: MovieList }
];

const {store, persistor} = configureStore();

//errorLogger();

//store.dispatch(loadAllRbcs());
//store.dispatch(loadUserInfo());

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <App>
                        <Switch>
                            {routes.map((route, i) => (
                                <Route path={route.path} component={route.component} key={i} />
                            ))}
                        </Switch>
                    </App>
                </Router>
            </PersistGate>
        </Provider>,
        document.getElementById('root')
    );

    //ReactDOM.render(
    //    <Provider store={store}>
    //            <Router>
    //                <App>
    //                    <Switch>
    //                        {routes.map((route, i) => (
    //                            <Route path={route.path} component={route.component} key={i} />
    //                        ))}
    //                    </Switch>
    //                </App>
    //            </Router>
    //    </Provider>,
    //    document.getElementById('root')
    //);
};

/*
const render = () => {
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <Route path="/" component={App} />
                </Router>
            </Provider>
        </ThemeProvider>,
        document.getElementById('root')
    );
};
*/

//injectGlobal`${theme.skins.Global(theme, process.env.NODE_ENV)}`; // eslint-disable-line no-unused-expressions

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
