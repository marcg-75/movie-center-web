import { useEffect, useState } from 'react';
import {
  BaseDataStateModel,
  loadFormats,
  MovieListStateModel,
} from '@giron/data-access-redux';
import { connect } from 'react-redux';
import { MovieFilter as MovieModelFilter } from '@giron/shared-models';
import { ExtendedFilter } from '@giron/shared-movie-components';

type Props = {
  filter: MovieModelFilter;
  baseData: BaseDataStateModel;
  filterChanged: (filter: MovieModelFilter) => void;
  dispatch: (any: unknown) => void;
}

const ExtendedFilterContent = ({
  filter,
  baseData,
  filterChanged,
  dispatch,
}: Props) => {
  const [filterLoading, setFilterLoading] = useState(true);

  useEffect(() => {
    dispatch(loadFormats());
  }, []);

  useEffect(() => {
    setFilterLoading(!filter || !baseData?.formatsLoaded);
  }, [filter, baseData]);

  return (
    <ExtendedFilter
      filter={filter}
      filterChanged={filterChanged}
      formats={baseData?.formats}
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

export default connect(stateToProps)(ExtendedFilterContent);
