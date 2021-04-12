import {combineReducers} from 'redux';

import baseData from './actions/base-data.reducer';
import movie from './actions/movie.reducer';
import person from './actions/person.reducer';

export default function getReducers() {
    const reducers = {
        baseData,
        movie,
        person
    };
    return combineReducers({ ...reducers });
}
