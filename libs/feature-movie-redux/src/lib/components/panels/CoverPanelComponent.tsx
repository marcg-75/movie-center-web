import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MovieStateModel, updateMovieState } from '@giron/data-access-redux';
import { IMovie } from '@giron/shared-models';
import { CoverPanel } from '@giron/shared-movie-components';

interface CoverPanelProps {
  movie: MovieStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const CoverPanelComponent = ({
  movie,
  dispatch,
  testName = 'CoverPanelComponent_test',
}: CoverPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie]);

  const { movieItem, movieLoading } = movie;

  return (
    <CoverPanel
      movie={movieItem}
      isLoading={isMovieLoading}
      onMovieChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
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
