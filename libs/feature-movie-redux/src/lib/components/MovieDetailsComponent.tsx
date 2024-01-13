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
  deleteMovie,
  getAllPersons,
  getEmptyMovie,
  getMovieById,
  loadRoles,
  loadStudios,
  MovieStateModel,
  updateMovie,
} from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../utils/movie.utils';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';
import { useForm } from 'react-hook-form';
import { removeUndefinedValuesFromObject } from '@giron/shared-util-helpers';
import { format } from 'date-fns';

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
  const [isInitDone, setIsInitDone] = useState(false);

  useEffect(() => {
    setIsInitDone(false);

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

    setIsInitDone(true);
  }, []);

  useEffect(() => {
    const { movieCreated, movieUpdated, movieDeleted } = movie;

    if (isInitDone && (movieCreated || movieUpdated || movieDeleted)) {
      // Clear action state
      dispatch(clearMovieActionState());

      // Navigate back to list.
      history.push(`/movies`);
    }
  }, [movie, baseData]);

  const { movieItem, movieLoading } = movie;

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<IMovie>();
  //   {
  //   defaultValues: movieItem,
  // }

  const onSave = (movieChanges: IMovie) => {
    if (!movieChanges) {
      return;
    }

    // Remove properties with undefined or null values. This since the change set sets undefined for all unchanged properties.
    removeUndefinedValuesFromObject(movieChanges);
    removeUndefinedValuesFromObject(movieChanges.movieFormatInfo);
    removeUndefinedValuesFromObject(movieChanges.moviePersonalInfo);

    const updatedMovie: IMovie = {
      ...movieItem,
      ...movieChanges,
      movieFormatInfo: {
        ...movieItem?.movieFormatInfo,
        ...movieChanges.movieFormatInfo,
      },
      moviePersonalInfo: {
        ...movieItem?.moviePersonalInfo,
        ...movieChanges.moviePersonalInfo,
      },
    };

    // Reformat runtime, since TimePicker makes it a long date string.
    if (updatedMovie.runtime) {
      updatedMovie.runtime = format(new Date(updatedMovie.runtime), 'HH:mm:ss');
    }

    if (!updatedMovie.id || updatedMovie.id === 0) {
      updatedMovie.id = undefined;
      dispatch(createMovie(updatedMovie));
    } else {
      dispatch(updateMovie(updatedMovie));
    }

    history.push('/');
  };

  const onReset = () => {
    reset();
  };

  const onCancel = () => {
    if (
      isDirty &&
      !window.confirm('Vill du avbryta redigeringen av denna film?')
    ) {
      return;
    }

    history.push('/');
  };

  const onDelete = (movieId: number) => {
    if (
      !window.confirm(
        'Vill du verkligen radera denna film? Det går inte att ångra sig efteråt.'
      )
    ) {
      return;
    }

    dispatch(deleteMovie(movieId));
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <MovieDetails
        control={control}
        movie={movieItem}
        isLoading={isMovieLoading || isBaseDataLoading}
        isCreateMode={movieId === 0}
        onDelete={onDelete}
        onReset={onReset}
        onCancel={onCancel}
        generalInfoPanel={
          <GeneralInfoPanel control={control} setValue={setValue} />
        }
        castPanel={<CastPanel setValue={setValue} />}
        crewPanel={<CrewPanel setValue={setValue} />}
        formatPanel={<FormatPanel control={control} setValue={setValue} />}
        coverPanel={<CoverPanel control={control} />}
        personalInfoPanel={<PersonalInfoPanel control={control} />}
        errors={movieLoading?.errors}
        testName={testName}
      />
    </form>
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
