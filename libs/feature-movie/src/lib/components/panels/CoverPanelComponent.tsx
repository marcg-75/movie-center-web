import { IMovie } from '@giron/shared-models';
import { CoverPanel } from '@giron/shared-movie-components';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  testName?: string;
};

export const CoverPanelComponent = ({
  movie,
  isMovieLoading,
  testName = 'CoverPanelComponent_test',
}: Props) => {
  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <CoverPanel
      movie={movie}
      isLoading={isMovieLoading}
      onMovieChange={notYetImplemented}
      testName={testName}
    />
  );
};
