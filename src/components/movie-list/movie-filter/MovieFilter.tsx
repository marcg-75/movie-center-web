import {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {environment} from '../../../env/environment';
import {
    clearFilterAndReloadMovies,
    clearMovieActionState,
    updateFilterAndReloadMovies
} from '../../../actions/movie.actions';

import ListFilter from '../../common/list-filter/ListFilterComponent';
import {MovieFilter as MovieModelFilter} from '../../../models/MovieModel';
import {FilterType} from '../../../models/FilterSettingsModel';
import ExtendedFilterContent from "./ExtendedFilterContent";
import RegularFilterContent from "./RegularFilterContent";

const helpFilter =
    'Du kan filtrera fram de filmer som du är intresserad i genom att välja kriteria ' +
    'eller skriva valfri text. Du kan återställa filtret genom att trycka på länken ' +
    '"Rensa filtrering", varefter alla filmer kommer att visas.';

interface MovieFilterProps {
    filter: MovieModelFilter,
    componentName: string;
    dispatch: (any: any) => void;
    testName?: string;
}

const MovieFilter = ({filter, componentName, dispatch, testName = 'MovieFilter_test'}: MovieFilterProps) => {

    useEffect(() => {
        dispatch(clearMovieActionState());
    }, []);

    const filterChanged = (filter: MovieModelFilter) => {
        dispatch(updateFilterAndReloadMovies(filter));
    };

    const clearFilter = () => {
        dispatch(clearFilterAndReloadMovies());
    };

    const loadFilter = (filter: MovieModelFilter) => {
        filterChanged(filter);
    };

    return (
        <div data-test-name={testName}>
            <ListFilter componentName={componentName}
                        header="Filtrering av filmer"
                        helpText={helpFilter}
                        clearFilter={clearFilter}
                        filter={filter}
                        filterType={FilterType.MOVIE}
                        loadFilter={loadFilter}
                        enableSaveFilter={environment.enableSaveMovieFilter}
                        compactModeActions={true}
                        regularContent={<RegularFilterContent filterChanged={filterChanged}/>}
                        extendedContent={<ExtendedFilterContent filterChanged={filterChanged}/>}
            />
        </div>
    );
};

function stateToProps({baseData, movie: {filter}}) {
    return {
        baseData,
        filter
    };
}

export default withRouter(connect(stateToProps)(MovieFilter));
