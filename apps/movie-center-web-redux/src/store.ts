import {
  applyMiddleware,
  compose,
  createStore,
  type Middleware,
  type Reducer,
  type UnknownAction,
} from 'redux';
import { thunk } from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { reducers } from '@giron/data-access-redux';

//import {authInterceptor} from './authInterceptorMiddleware';

const composeEnhancers = /*window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ||*/ compose; // eslint-disable-line no-underscore-dangle

const persistConfig = {
  key: 'mc_store',
  storage,
};

const rootReducer = reducers();
type RootState = ReturnType<typeof rootReducer>;
const typedRootReducer: Reducer<RootState, UnknownAction> = (state, action) =>
  rootReducer(state, action as unknown as Parameters<typeof rootReducer>[1]);
const persistedReducers = persistReducer<RootState, UnknownAction>(persistConfig, typedRootReducer);

//export default () => {
//    let store = createStore(persistedReducers);
//    let persistor = persistStore(store)
//    return { store, persistor }
//}

export default function configureStore() {
  const store = createStore(
    persistedReducers,
    composeEnhancers(applyMiddleware(thunk, apiMiddleware as Middleware)),
  );
  const persistor = persistStore(store);

  // if (module.hot) {
  //     // Enable Webpack hot module replacement for reducers
  //     module.hot.accept('./reducers', () => {
  //         const nextRootReducer = require('./reducers').default;
  //         store.replaceReducer(nextRootReducer);
  //     });
  // }
  return { store, persistor };
}
