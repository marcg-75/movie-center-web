import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  BaseDataStateModel,
  loadGenres,
  MovieListStateModel,
} from '@giron/data-access-redux';
import { MovieFilter as MovieModelFilter } from '@giron/shared-models';
import { RegularFilter } from '@giron/shared-movie-components';

type Props = {
  filter: MovieModelFilter;
  baseData: BaseDataStateModel;
  filterChanged: (filter: MovieModelFilter) => void;
  dispatch: (any: unknown) => void;
};

const RegularFilterContent = ({
  filter,
  baseData,
  filterChanged,
  dispatch,
}: Props) => {
  const [filterLoading, setFilterLoading] = useState(true);

  useEffect(() => {
    dispatch(loadGenres());
  }, []);

  useEffect(() => {
    setFilterLoading(!filter || !baseData || baseData.genresLoading?.loading);
  }, [filter, baseData]);

  return (
    <RegularFilter
      filter={filter}
      filterChanged={filterChanged}
      genres={baseData?.genres}
      isLoading={filterLoading}
    />
  );
};

function stateToProps({
  baseData,
  movieList: { filter },
}: {
  baseData: BaseDataStateModel;
  movieList: MovieListStateModel;
}) {
  return {
    baseData,
    filter,
  };
}

export default connect(stateToProps)(RegularFilterContent);
