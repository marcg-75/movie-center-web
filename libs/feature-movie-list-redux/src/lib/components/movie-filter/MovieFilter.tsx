import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  clearFilterAndReloadMovies,
  clearMovieActionState,
  MovieListStateModel,
  updateFilterAndReloadMovies,
} from '@giron/data-access-redux';

import ListFilter from '../list-filter/ListFilterComponent';
import { FilterType } from '../../models/FilterSettingsModel';
import ExtendedFilterContent from './ExtendedFilterContent';
import RegularFilterContent from './RegularFilterContent';
import { MovieFilter as MovieModelFilter } from '../../models/MovieFilter';
import { environment } from '../../../../../../apps/movie-center-web-redux/src/env/environment';

const helpFilter =
  'Du kan filtrera fram de filmer som du är intresserad i genom att välja kriteria ' +
  'eller skriva valfri text. Du kan återställa filtret genom att trycka på länken ' +
  '"Rensa filtrering", varefter alla filmer kommer att visas.';

interface MovieFilterProps {
  filter: MovieModelFilter;
  componentName: string;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const MovieFilter = ({
  filter,
  componentName,
  dispatch,
  testName = 'MovieFilter_test',
}: MovieFilterProps) => {
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
      <ListFilter
        componentName={componentName}
        header="Filtrering av filmer"
        helpText={helpFilter}
        clearFilter={clearFilter}
        filter={filter}
        filterType={FilterType.MOVIE}
        loadFilter={loadFilter}
        enableSaveFilter={environment.enableSaveMovieFilter}
        compactModeActions={true}
        regularContent={<RegularFilterContent filterChanged={filterChanged} />}
        extendedContent={
          <ExtendedFilterContent filterChanged={filterChanged} />
        }
      />
    </div>
  );
};

function stateToProps({
  movieList: { filter },
}: {
  movieList: MovieListStateModel;
}) {
  return {
    filter,
  };
}

export default connect(stateToProps)(MovieFilter);
