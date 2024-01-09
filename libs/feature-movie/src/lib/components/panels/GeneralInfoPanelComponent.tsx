import { IMovie } from '@giron/shared-models';
import { GeneralInfoPanel } from '@giron/shared-movie-components';
import { useGenres, useStudios } from '@giron/data-access';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  testName?: string;
};

export const GeneralInfoPanelComponent = ({
  movie,
  isMovieLoading,
  testName = 'GeneralInfoPanelComponent_test',
}: Props) => {
  const { genres, isGenresLoading } = useGenres();
  const { studios, isStudiosLoading } = useStudios();

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <GeneralInfoPanel
      movie={movie}
      genres={genres}
      studios={studios}
      onMovieChange={notYetImplemented}
      isLoading={isMovieLoading || isGenresLoading || isStudiosLoading}
      testName={testName}
    />
  );
};
