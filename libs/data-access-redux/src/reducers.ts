import { combineReducers } from 'redux';

import baseData from './reducers/base-data.reducer';
import { movieReducer } from './reducers/movie.reducer';
import person from './reducers/person.reducer';
import { movieListReducer } from './reducers/movie-list.reducer';

export const getReducers = () => {
  const reducers = {
    baseData,
    movie: movieReducer,
    movieList: movieListReducer,
    person,
  };
  return combineReducers({ ...reducers });
};
