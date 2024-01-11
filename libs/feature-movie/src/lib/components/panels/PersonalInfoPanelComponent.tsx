import { IMovie, MoviePersonalInfo } from '@giron/shared-models';
import { PersonalInfoPanel } from '@giron/shared-movie-components';
import { Control, UseFormSetValue } from 'react-hook-form';

interface PersonalInfoPanelProps {
  moviePersonalInfo?: MoviePersonalInfo;
  isMovieLoading: boolean;
  error?: string | Error | unknown;
  control: Control<IMovie>;
  testName?: string;
}

export const PersonalInfoPanelComponent = ({
  moviePersonalInfo = {} as MoviePersonalInfo,
  isMovieLoading,
  control,
  error,
  testName = 'PersonalInfoPanelComponent_test',
}: PersonalInfoPanelProps) => {
  return (
    <PersonalInfoPanel
      control={control}
      moviePersonalInfo={moviePersonalInfo}
      isLoading={isMovieLoading}
      error={error}
      testName={testName}
    />
  );
};
