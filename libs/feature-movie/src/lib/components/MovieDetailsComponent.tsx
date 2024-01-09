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

type Props = {
  movieId: number;
  testName?: string;
};

export const MovieDetailsComponent = ({ movieId, testName }: Props) => {
  const router = useRouter();
  const { movie, isMovieLoading, error } = useMovieDetails(movieId);

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <MovieDetails
      movie={movie}
      isLoading={isMovieLoading}
      isCreateMode={movieId === 0}
      onCreateMovie={notYetImplemented}
      onUpdateMovie={notYetImplemented}
      onMovieTitleChange={notYetImplemented}
      onCancel={() => router.back()}
      generalInfoPanel={
        <GeneralInfoPanelComponent
          movie={movie}
          isMovieLoading={isMovieLoading}
        />
      }
      castPanel={
        <CastPanelComponent movie={movie} isMovieLoading={isMovieLoading} />
      }
      crewPanel={
        <CrewPanelComponent movie={movie} isMovieLoading={isMovieLoading} />
      }
      formatPanel={
        <FormatPanelComponent movie={movie} isMovieLoading={isMovieLoading} />
      }
      coverPanel={
        <CoverPanelComponent movie={movie} isMovieLoading={isMovieLoading} />
      }
      personalInfoPanel={
        <PersonalInfoPanelComponent
          movie={movie}
          isMovieLoading={isMovieLoading}
        />
      }
      error={error}
      testName={testName}
    />
  );
};
