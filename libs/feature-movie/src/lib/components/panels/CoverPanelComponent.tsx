import { IMovie } from '@giron/shared-models';
import { CoverPanel } from '@giron/shared-movie-components';
import { Control } from 'react-hook-form';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  control: Control<IMovie>;
  testName?: string;
};

export const CoverPanelComponent = ({
  movie,
  isMovieLoading,
  control,
  testName = 'CoverPanelComponent_test',
}: Props) => {
  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <CoverPanel
      control={control}
      movie={movie}
      isLoading={isMovieLoading}
      onMovieChange={notYetImplemented}
      testName={testName}
    />
  );
};
