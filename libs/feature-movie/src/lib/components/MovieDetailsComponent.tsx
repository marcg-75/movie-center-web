'use client';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';
import { useCreateMovieMutation, useMovieDetails, useUpdateMovieMutation, } from '@giron/data-access';
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
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { movie, isMovieLoading, error } = useMovieDetails(movieId);

  useEffect(() => {
    if (movie) {
      setMovieDetails(movie);
    }
  }, [movie]);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
    getValues,
  } = useForm<IMovie>();
  //   {
  //   defaultValues: movieDetails,
  // }

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();

  const onSave = (movieChanges: IMovie) => {
    if (!movieChanges) {
      return;
    }

    // Remove properties with undefined or null values. This since the change set sets undefined for all unchanged properties.
    removeUndefinedValuesFromObject(movieChanges);
    removeUndefinedValuesFromObject(movieChanges.movieFormatInfo);
    removeUndefinedValuesFromObject(movieChanges.moviePersonalInfo);

    setIsSaving(true);

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
      }
    };

    // Reformat runtime, since TimePicker makes it a long date string.
    if (updatedMovie.runtime) {
      updatedMovie.runtime = format(new Date(updatedMovie.runtime), 'HH:mm:ss');
    }

    if (!updatedMovie.id || updatedMovie.id === 0) {
      updatedMovie.id = undefined;
      createMovieMutation.mutate(updatedMovie);
    } else {
      updateMovieMutation.mutate(updatedMovie);
    }

    setIsSaving(false);
    router.push('/');
  };

  // const removeUndefinedValuesFromObject = <T>(obj: T) => {
  //   // @ts-ignore
  //   Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  // };

  const onReset = () => {
    reset();
  };

  const onCancel = () => {

    if (isDirty && !window.confirm('Vill du avbryta redigeringen av denna film?')) {
      return;
    }

    router.push('/')
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <MovieDetails
        movie={movieDetails}
        isLoading={isMovieLoading || isSaving}
        isCreateMode={movieId === 0}
        onReset={onReset}
        onCancel={onCancel}
        control={control}
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
