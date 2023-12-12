import { applyMiddleware, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import reducers from './reducers';
//import {authInterceptor} from './authInterceptorMiddleware';

const initialState = {};
const composeEnhancers =
  /*window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ||*/ compose; // eslint-disable-line no-underscore-dangle

const persistConfig = {
  key: 'mc_store',
  storage,
};

const persistedReducers = persistReducer(persistConfig, reducers());

//export default () => {
//    let store = createStore(persistedReducers);
//    let persistor = persistStore(store)
//    return { store, persistor }
//}

export default function configureStore() {
  const store = createStore(
    persistedReducers,
    initialState,
    composeEnhancers(applyMiddleware(reduxThunk, apiMiddleware))
  );
  let persistor = persistStore(store);

  // if (module.hot) {
  //     // Enable Webpack hot module replacement for reducers
  //     module.hot.accept('./reducers', () => {
  //         const nextRootReducer = require('./reducers').default;
  //         store.replaceReducer(nextRootReducer);
  //     });
  // }
  return { store, persistor };
}
