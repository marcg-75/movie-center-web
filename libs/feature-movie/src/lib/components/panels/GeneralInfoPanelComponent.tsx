import { IMovie } from '@giron/shared-models';
import { GeneralInfoPanel } from '@giron/shared-movie-components';
import { useGenres, useStudios } from '@giron/data-access';
import { Control, UseFormSetValue } from 'react-hook-form';

type Props = {
  movie: IMovie;
  isMovieLoading: boolean;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  testName?: string;
};

export const GeneralInfoPanelComponent = ({
  movie,
  isMovieLoading,
  control,
  setValue,
  testName = 'GeneralInfoPanelComponent_test',
}: Props) => {
  const { genres, isGenresLoading } = useGenres();
  const { studios, isStudiosLoading } = useStudios();

  return (
    <GeneralInfoPanel
      control={control}
      setValue={setValue}
      movie={movie}
      genres={genres}
      studios={studios}
      isLoading={isMovieLoading || isGenresLoading || isStudiosLoading}
      testName={testName}
    />
  );
};
