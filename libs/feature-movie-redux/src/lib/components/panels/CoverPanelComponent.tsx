import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MovieStateModel } from '@giron/data-access-redux';
import { IMovie, MovieFormatInfo } from '@giron/shared-models';
import { CoverPanel } from '@giron/shared-movie-components';
import { Control } from 'react-hook-form';

interface CoverPanelProps {
  movie: MovieStateModel;
  control: Control<IMovie>;
  testName?: string;
}

const CoverPanelComponent = ({
  movie,
  control,
  testName = 'CoverPanelComponent_test',
}: CoverPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie]);

  const { movieItem, movieLoading } = movie;

  return (
    <CoverPanel
      control={control}
      movieFormatInfo={movieItem?.movieFormatInfo || ({} as MovieFormatInfo)}
      isLoading={isMovieLoading}
      errors={movieLoading.errors}
      testName={testName}
    />
  );
};

function stateToProps({ movie }: { movie: MovieStateModel }) {
  return {
    movie,
  };
}

export default connect(stateToProps)(CoverPanelComponent);
