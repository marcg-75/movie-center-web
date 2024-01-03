import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  clearFilterAndReloadMovies,
  clearMovieActionState,
  updateFilterAndReloadMovies,
} from '@giron/data-access-redux';

import { MovieFilter as MovieModelFilter } from '@giron/shared-models';
import ExtendedFilterContent from './ExtendedFilterContent';
import RegularFilterContent from './RegularFilterContent';
import { ListFilter } from '@giron/shared-movie-components';

const helpFilter =
  'Du kan filtrera fram de filmer som du är intresserad i genom att välja kriteria ' +
  'eller skriva valfri text. Du kan återställa filtret genom att trycka på länken ' +
  '"Rensa filtrering", varefter alla filmer kommer att visas.';

type Props = {
  dispatch: (any: unknown) => void;
  testName?: string;
};

export const MovieFilterComponent = ({
  dispatch,
  testName = 'MovieFilter_test',
}: Props) => {
  useEffect(() => {
    dispatch(clearMovieActionState());
  }, []);

  const filterChanged = (filter: MovieModelFilter) => {
    dispatch(updateFilterAndReloadMovies(filter));
  };

  const clearFilter = () => {
    dispatch(clearFilterAndReloadMovies());
  };

  return (
    <div data-test-name={testName}>
      <ListFilter
        header="Filtrering av filmer"
        helpText={helpFilter}
        clearFilter={clearFilter}
        enableSaveFilter={process.env.NX_ENABLE_SAVE_MOVIE_FILTER === 'true'}
        compactModeActions={true}
        regularContent={<RegularFilterContent filterChanged={filterChanged} />}
        extendedContent={
          <ExtendedFilterContent filterChanged={filterChanged} />
        }
      />
    </div>
  );
};

export default connect(() => ({}))(MovieFilterComponent);
