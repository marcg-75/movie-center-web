import { IMovie } from '@giron/shared-models';
import { PersonalInfoPanel } from '@giron/shared-movie-components';
import { Control } from 'react-hook-form';

interface PersonalInfoPanelProps {
  movie?: IMovie;
  isMovieLoading: boolean;
  error?: string | Error | unknown;
  control: Control<IMovie>;
  testName?: string;
}

export const PersonalInfoPanelComponent = ({
  movie,
  isMovieLoading,
  control,
  error,
  testName = 'PersonalInfoPanelComponent_test',
}: PersonalInfoPanelProps) => {
  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <PersonalInfoPanel
      control={control}
      movie={movie}
      isLoading={isMovieLoading}
      onMovieChange={notYetImplemented}
      error={error}
      testName={testName}
    />
  );
};
