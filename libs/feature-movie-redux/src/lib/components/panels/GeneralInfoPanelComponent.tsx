import { useState } from 'react';
import { connect } from 'react-redux';
import {
  BaseDataStateModel,
  MovieStateModel,
  updateMovieState,
} from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../../utils/movie.utils';
import { IMovie } from '@giron/shared-models';
import { GeneralInfoPanel } from '@giron/shared-movie-components';

type Props = {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
};

const GeneralInfoPanelComponent = ({
  movie,
  baseData,
  dispatch,
  testName = 'GeneralInfoPanelComponent_test',
}: Props) => {
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  const { movieItem, movieLoading } = movie;
  const { genres, studios } = baseData;

  return (
    <GeneralInfoPanel
      movie={movieItem}
      genres={genres}
      studios={studios}
      onMovieChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
      isLoading={isMovieLoading || isBaseDataLoading}
      errors={movieLoading.errors}
      testName={testName}
    />
  );
};

function stateToProps({
  movie,
  baseData,
}: {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
}) {
  return {
    movie,
    baseData,
  };
}

export default connect(stateToProps)(GeneralInfoPanelComponent);
