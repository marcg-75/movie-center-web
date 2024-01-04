import { useState } from 'react';
import { connect } from 'react-redux';
import { BaseDataStateModel, MovieStateModel, updateMovieState, } from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../../utils/movie.utils';
import { IMovie, } from '@giron/shared-models';
import { GeneralInfoPanel } from '@giron/shared-movie-components';

interface GeneralInfoPanelProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const GeneralInfoPanelComponent = ({
                                     movie,
                                     baseData,
                                     dispatch,
                                     testName = 'GeneralInfoPanelComponent_test',
                                   }: GeneralInfoPanelProps) => {
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  const { movieItem, movieLoading } = movie;
  const { genres, studios } = baseData;

  const refreshMovieState = (movieItem: IMovie) => {
    dispatch(
      updateMovieState(movieItem)
    );
  };

  return (
    <GeneralInfoPanel
      movie={movieItem}
      genres={genres}
      studios={studios}
      onMovieChange={refreshMovieState}
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
