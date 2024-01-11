'use client';
import { IMovie } from '@giron/shared-models';
import { MovieDetails } from '@giron/shared-movie-components';
import { useMovieDetails } from '@giron/data-access';
import { GeneralInfoPanelComponent } from './panels/GeneralInfoPanelComponent';
import { useRouter } from 'next/navigation';
import { CoverPanelComponent } from './panels/CoverPanelComponent';
import { FormatPanelComponent } from './panels/FormatPanelComponent';
import { CastPanelComponent } from './panels/CastPanelComponent';
import { CrewPanelComponent } from './panels/CrewPanelComponent';
import { PersonalInfoPanelComponent } from './panels/PersonalInfoPanelComponent';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type Props = {
  movieId: number;
  testName?: string;
};

export const MovieDetailsComponent = ({ movieId, testName }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { movie, isMovieLoading, error } = useMovieDetails(movieId);

  const {
    control,
    handleSubmit,
    formState: { errors: validationErrors },
    reset,
    setValue,
  } = useForm<IMovie>({
    defaultValues: movie,
  });

  const onSave = (movieChanges: IMovie) => {
    if (!movieChanges) {
      return;
    }

    setIsSaving(true);

    alert('Saving movie. Changes: ' + JSON.stringify(movieChanges));

    const updatedMovie: IMovie = {
      ...movie,
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

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <form onSubmit={handleSubmit((m: IMovie) => onSave(m))}>
      <MovieDetails
        movie={movie}
        isLoading={isMovieLoading || isSaving}
        isCreateMode={movieId === 0}
        onCreateMovie={notYetImplemented}
        onUpdateMovie={notYetImplemented}
        onMovieTitleChange={notYetImplemented}
        onReset={onReset}
        onGoToList={() => router.push('/')}
        control={control}
        generalInfoPanel={
          <GeneralInfoPanelComponent
            control={control}
            setValue={setValue}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        castPanel={
          <CastPanelComponent
            setValue={setValue}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        crewPanel={
          <CrewPanelComponent
            setValue={setValue}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        formatPanel={
          <FormatPanelComponent
            control={control}
            setValue={setValue}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        coverPanel={
          <CoverPanelComponent
            control={control}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        personalInfoPanel={
          <PersonalInfoPanelComponent
            control={control}
            movie={movie}
            isMovieLoading={isMovieLoading}
          />
        }
        error={error}
        testName={testName}
      />
    </form>
  );
};
