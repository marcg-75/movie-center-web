import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  BaseDataStateModel,
  getCrew,
  MovieStateModel,
  PersonStateModel,
  updateMovieState,
} from '@giron/data-access-redux';
import { IMovie } from '@giron/shared-models';
import { CrewPanel } from '@giron/shared-movie-components';

interface CrewPanelProps {
  movie: MovieStateModel;
  person: PersonStateModel;
  baseData: BaseDataStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const CrewPanelComponent = ({
  movie,
  person,
  baseData,
  dispatch,
  testName = 'CrewPanelComponent_test',
}: CrewPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isCrewLoading, setIsCrewLoading] = useState(false);

  useEffect(() => {
    if (
      !isCrewLoading &&
      ((!crewLoading?.loading && !crewLoading?.loaded) || !crew?.length)
    ) {
      setIsCrewLoading(true);
      dispatch(getCrew());
    }
  }, []);

  useEffect(() => {
    setIsCrewLoading(crewLoading?.loading);
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie, person]);

  const { movieItem } = movie;
  const { persons, crew, crewLoading, personsLoading } = person;
  const roles = baseData.roles || [];

  return (
    <CrewPanel
      movie={movieItem}
      crew={crew}
      persons={persons}
      roles={roles}
      isMovieLoading={isMovieLoading}
      isCrewLoading={crewLoading?.loading}
      isPersonsLoading={personsLoading?.loading}
      onMovieChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
      errors={crewLoading?.errors}
      testName={testName}
    />
  );
};

function stateToProps({
  movie,
  person,
  baseData,
}: {
  movie: MovieStateModel;
  person: PersonStateModel;
  baseData: BaseDataStateModel;
}) {
  return {
    movie,
    person,
    baseData,
  };
}

export default connect(stateToProps)(CrewPanelComponent);
