import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MovieStateModel, updateMovieState } from '@giron/data-access-redux';
import { IMovie } from '@giron/shared-models';
import { PersonalInfoPanel } from '@giron/shared-movie-components';

interface PersonalInfoPanelProps {
  movie: MovieStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const PersonalInfoPanelComponent = ({
                                      movie,
                                      dispatch,
                                      testName = 'PersonalInfoPanelComponent_test',
                                    }: PersonalInfoPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie]);

  const { movieItem, movieLoading } = movie;

  const refreshMovieState = (movieItem: IMovie) => {
    dispatch(
      updateMovieState(movieItem)
    );
  };

  return (
    <PersonalInfoPanel
      movie={movieItem}
      isLoading={isMovieLoading}
      onMovieChange={refreshMovieState}
      errors={movieLoading?.errors}
      testName={testName}
    />
  );
};

function stateToProps({ movie }: { movie: MovieStateModel }) {
  return {
    movie,
  };
}

export default connect(stateToProps)(PersonalInfoPanelComponent);
