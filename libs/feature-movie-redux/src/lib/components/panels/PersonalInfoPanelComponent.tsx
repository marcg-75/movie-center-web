import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MovieStateModel } from '@giron/data-access-redux';
import { IMovie, MoviePersonalInfo } from '@giron/shared-models';
import { PersonalInfoPanel } from '@giron/shared-movie-components';
import { Control } from 'react-hook-form';

interface PersonalInfoPanelProps {
  movie: MovieStateModel;
  control: Control<IMovie>;
  testName?: string;
}

const PersonalInfoPanelComponent = ({
  movie,
  control,
  testName = 'PersonalInfoPanelComponent_test',
}: PersonalInfoPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie]);

  const { movieItem, movieLoading } = movie;

  return (
    <PersonalInfoPanel
      control={control}
      moviePersonalInfo={
        movieItem?.moviePersonalInfo || ({} as MoviePersonalInfo)
      }
      isLoading={isMovieLoading}
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
