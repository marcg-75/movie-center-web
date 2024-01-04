import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as H from 'history';
import GeneralInfoPanel from './panels/GeneralInfoPanelComponent';
import CastPanel from './panels/CastPanelComponent';
import CrewPanel from './panels/CrewPanelComponent';
import FormatPanel from './panels/FormatPanelComponent';
import CoverPanel from './panels/CoverPanelComponent';
import PersonalInfoPanel from './panels/PersonalInfoPanelComponent';
import {
  BaseDataStateModel,
  clearMovieActionState,
  createMovie,
  getAllPersons,
  getEmptyMovie,
  getMovieById,
  loadRoles,
  loadStudios,
  MovieStateModel,
  updateMovie,
  updateMovieState,
} from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../utils/movie.utils';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';

interface MovieProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  history: H.History;
  location: H.Location;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const MovieDetailsComponent = ({
  movie,
  baseData,
  history,
  location,
  dispatch,
  testName = 'MovieDetailsComponent_test',
}: MovieProps) => {
  const [movieId, setMovieId] = useState<number>();
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  useEffect(() => {
    const { pathname } = location;
    const movieId = parseInt(
      pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length),
      10
    );

    // Clear action state
    dispatch(clearMovieActionState());

    dispatch(loadStudios());
    dispatch(loadRoles());

    if (process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true') {
      dispatch(getAllPersons());
    }

    setMovieId(movieId);

    if (movieId === 0) {
      dispatch(getEmptyMovie());
    } else {
      dispatch(getMovieById(movieId));
    }
  }, []);

  useEffect(() => {
    const { movieCreated, movieUpdated } = movie;

    if (movieCreated || movieUpdated) {
      // Clear action state
      dispatch(clearMovieActionState());

      // Navigate back to list.
      history.push(`/movies`);
    }
  }, [movie, baseData]);

  const { movieItem, movieLoading } = movie;

  return (
    <MovieDetails
      movie={movieItem}
      isLoading={isMovieLoading || isBaseDataLoading}
      isCreateMode={movieId === 0}
      onCreateMovie={(movie: IMovie) => dispatch(createMovie(movie))}
      onUpdateMovie={(movie: IMovie) => dispatch(updateMovie(movie))}
      onMovieTitleChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
      onCancel={() => history.goBack()}
      generalInfoPanel={<GeneralInfoPanel />}
      castPanel={<CastPanel />}
      crewPanel={<CrewPanel />}
      formatPanel={<FormatPanel />}
      coverPanel={<CoverPanel />}
      personalInfoPanel={<PersonalInfoPanel />}
      errors={movieLoading?.errors}
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

export default withRouter(connect(stateToProps)(MovieDetailsComponent));
