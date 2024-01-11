'use client';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';
import {
  useCreateMovieMutation,
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
    formState: { errors: validationErrors },
    reset,
    setValue,
  } = useForm<IMovie>({
    defaultValues: movieDetails,
  });

  const createMovieMutation = useCreateMovieMutation();
  const updateMovieMutation = useUpdateMovieMutation();

  const onSave = (movieChanges: IMovie) => {
    if (!movieChanges) {
      return;
    }

    setIsSaving(true);

    alert('Saving movie. Changes: ' + JSON.stringify(movieChanges));

    const updatedMovie: IMovie = {
      ...movieDetails,
      ...movieChanges,
    };

    if (!movieChanges.id || movieChanges.id === 0) {
      movieChanges.id = undefined;
      // TODO: useCreateMovieMutation
    } else {
      // TODO: useUpdateMovieMutation
    }

    setIsSaving(false);
    router.push('/');
  };

  const onReset = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit((m: IMovie) => onSave(m))}>
      <MovieDetails
        movie={movieDetails}
        isLoading={isMovieLoading || isSaving}
        isCreateMode={movieId === 0}
        onReset={onReset}
        onGoToList={() => router.push('/')}
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
