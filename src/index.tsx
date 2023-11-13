import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './store';
import App from './components/App';
import MovieList from './components/movie-list/MovieList';
import Movie from './components/movie/Movie';

// TODO: Currently not in use. Possibly a move to Next.js is required.

export default function Index() {
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

    return (
        <>
            <span>Pip</span>
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
        </Provider>
        </>
    );
}

// const render = () => {
//     ReactDOM.render(
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
//         document.getElementById('root')
//     );
// };

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

// render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
