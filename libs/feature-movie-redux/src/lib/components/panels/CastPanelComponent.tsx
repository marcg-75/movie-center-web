import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  getActors,
  MovieStateModel,
  PersonStateModel,
  updateMovieState,
} from '@giron/data-access-redux';
import { IMovie } from '@giron/shared-models';
import { CastPanel } from '@giron/shared-movie-components';

interface CastPanelProps {
  movie: MovieStateModel;
  person: PersonStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const CastPanelComponent = ({
  movie,
  person,
  dispatch,
  testName = 'CastPanelComponent_test',
}: CastPanelProps) => {
  const { movieItem } = movie;
  const { persons, actors, actorsLoading, personsLoading } = person;

  const [isActorsLoading, setIsActorsLoading] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    if (
      !isActorsLoading &&
      ((!actorsLoading?.loading && !actorsLoading?.loaded) || !actors?.length)
    ) {
      setIsActorsLoading(true);
      dispatch(getActors());
    }
  }, []);

  useEffect(() => {
    setIsActorsLoading(actorsLoading?.loading);
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie, person]);

  return (
    <CastPanel
      movie={movieItem}
      actors={actors}
      persons={persons}
      isMovieLoading={isMovieLoading}
      isActorsLoading={isActorsLoading}
      isPersonsLoading={personsLoading?.loading}
      onMovieChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
      errors={actorsLoading?.errors}
      testName={testName}
    />
  );
};

function stateToProps({
  movie,
  person,
}: {
  movie: MovieStateModel;
  person: PersonStateModel;
}) {
  return {
    movie,
    person,
  };
}

export default connect(stateToProps)(CastPanelComponent);
