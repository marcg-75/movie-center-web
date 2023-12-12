import { combineReducers } from 'redux';

import baseData from './actions/base-data.reducer';
import { movieReducer } from './actions/movie.reducer';
import person from './actions/person.reducer';
import { movieListReducer } from './actions/movie-list.reducer';

export default function getReducers() {
  const reducers = {
    baseData,
    movie: movieReducer,
    movieList: movieListReducer,
    person,
  };
  return combineReducers({ ...reducers });
}
