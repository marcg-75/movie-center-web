'use client';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';
import {
  useCreateMovieMutation,
  useDeleteMovieMutation,
  useMovieDetails,
  useUpdateMovieMutation,
} from '@giron/data-access';
import { GeneralInfoPanelComponent } from './panels/GeneralInfoPanelComponent';
import { useRouter } from 'next/navigation';
import { CoverPanelComponent } from './panels/CoverPanelComponent';
import { FormatPanelComponent } from './panels/FormatPanelComponent';
import { CastPanelComponent } from './panels/CastPanelComponent';
import { CrewPanelComponent } from './panels/CrewPanelComponent';
import { PersonalInfoPanelComponent } from './panels/PersonalInfoPanelComponent';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { removeUndefinedValuesFromObject } from '@giron/shared-util-helpers';
import { format } from 'date-fns';

type Props = {
  movieId: number;
  testName?: string;
};

export const MovieDetailsComponent = ({ movieId, testName }: Props) => {
  const [movieDetails, setMovieDetails] = useState<IMovie>(
    {} as unknown as IMovie
  );
  const router = useRouter();
  const {
    movie,
    isMovieLoading,
    error: movieLoadingError,
  } = useMovieDetails(movieId);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    if (movie) {
      setMovieDetails(movie);
    }
  }, [movie]);

  useEffect(() => {
    setError(movieLoadingError);
  }, [movieLoadingError]);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<IMovie>();
  //   {
  //   defaultValues: movieDetails,
  // }

  const { mutate: createMovieMutate, isLoading: isCreatingMovie } =
    useCreateMovieMutation();
  const { mutate: updateMovieMutate, isLoading: isUpdatingMovie } =
    useUpdateMovieMutation();
  const { mutate: deleteMovieMutate, isLoading: isDeletingMovie } =
    useDeleteMovieMutation();

  const onSave = (movieChanges: IMovie) => {
    setError(undefined);

    if (!movieChanges) {
      return;
    }

    // Remove properties with undefined or null values. This since the change set sets undefined for all unchanged properties.
    removeUndefinedValuesFromObject(movieChanges);
    removeUndefinedValuesFromObject(movieChanges.movieFormatInfo);
    removeUndefinedValuesFromObject(movieChanges.moviePersonalInfo);

    const updatedMovie: IMovie = {
      ...movieDetails,
      ...movieChanges,
      movieFormatInfo: {
        ...movieDetails.movieFormatInfo,
        ...movieChanges.movieFormatInfo,
      },
      moviePersonalInfo: {
        ...movieDetails.moviePersonalInfo,
        ...movieChanges.moviePersonalInfo,
      },
    };

    // Reformat runtime, since TimePicker makes it a long date string.
    if (updatedMovie.runtime) {
      updatedMovie.runtime = format(new Date(updatedMovie.runtime), 'HH:mm:ss');
    }

    if (!updatedMovie.id || updatedMovie.id === 0) {
      updatedMovie.id = undefined;
      createMovieMutate(updatedMovie, {
        onSuccess: () => router.push('/'),
        onError: (error) => setError(error),
      });
    } else {
      updateMovieMutate(updatedMovie, {
        onSuccess: () => router.push('/'),
        onError: (error) => setError(error),
      });
    }
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

    router.push('/');
  };

  const onDelete = (movieId: number) => {
    setError(undefined);

    if (
      !window.confirm(
        'Vill du verkligen radera denna film? Det går inte att ångra sig efteråt.'
      )
    ) {
      return;
    }

    deleteMovieMutate(movieId, {
      onSuccess: () => router.push('/'),
      onError: (error) => setError(error),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <MovieDetails
        control={control}
        movie={movieDetails}
        isLoading={
          isMovieLoading ||
          isCreatingMovie ||
          isUpdatingMovie ||
          isDeletingMovie
        }
        isCreateMode={movieId === 0}
        onDelete={onDelete}
        onReset={onReset}
        onCancel={onCancel}
        generalInfoPanel={
          <GeneralInfoPanelComponent
            control={control}
            setValue={setValue}
            movie={movieDetails}
            isMovieLoading={isMovieLoading}
          />
        }
        castPanel={
          <CastPanelComponent
            setValue={setValue}
            movie={movieDetails}
            isMovieLoading={isMovieLoading}
          />
        }
        crewPanel={
          <CrewPanelComponent
            setValue={setValue}
            movie={movieDetails}
            isMovieLoading={isMovieLoading}
          />
        }
        formatPanel={
          <FormatPanelComponent
            control={control}
            setValue={setValue}
            movieFormatInfo={movieDetails.movieFormatInfo}
            isMovieLoading={isMovieLoading}
          />
        }
        coverPanel={
          <CoverPanelComponent
            control={control}
            movieFormatInfo={movieDetails.movieFormatInfo}
            isMovieLoading={isMovieLoading}
          />
        }
        personalInfoPanel={
          <PersonalInfoPanelComponent
            control={control}
            moviePersonalInfo={movieDetails.moviePersonalInfo}
            isMovieLoading={isMovieLoading}
          />
        }
        error={error}
        testName={testName}
      />
    </form>
  );
};
