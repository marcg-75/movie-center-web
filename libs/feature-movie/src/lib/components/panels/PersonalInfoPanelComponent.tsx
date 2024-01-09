import { IMovie } from '@giron/shared-models';
import { PersonalInfoPanel } from '@giron/shared-movie-components';

interface PersonalInfoPanelProps {
  movie?: IMovie;
  isMovieLoading: boolean;
  error?: string | Error | unknown;
  testName?: string;
}

export const PersonalInfoPanelComponent = ({
  movie,
  isMovieLoading,
  error,
  testName = 'PersonalInfoPanelComponent_test',
}: PersonalInfoPanelProps) => {
  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <PersonalInfoPanel
      movie={movie}
      isLoading={isMovieLoading}
      onMovieChange={notYetImplemented}
      error={error}
      testName={testName}
    />
  );
};
