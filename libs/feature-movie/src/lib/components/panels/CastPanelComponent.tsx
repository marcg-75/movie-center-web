import { IMovie } from '@giron/shared-models';
import { CastPanel } from '@giron/shared-movie-components';
import { useActors, useAllPersons } from '@giron/data-access';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  loadAllPersons?: boolean;
  testName?: string;
};

export const CastPanelComponent = ({
  movie,
  isMovieLoading,
  loadAllPersons = false,
  testName = 'CastPanelComponent_test',
}: Props) => {
  const { actors, isActorsLoading, error: actorsError } = useActors();
  const {
    persons,
    isPersonsLoading,
    error: personsError,
  } = useAllPersons(loadAllPersons);

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <CastPanel
      movie={movie}
      actors={actors}
      persons={persons}
      isMovieLoading={isMovieLoading}
      isActorsLoading={isActorsLoading}
      isPersonsLoading={isPersonsLoading}
      onMovieChange={notYetImplemented}
      error={actorsError || personsError}
      enableSelectFromAllPersons={loadAllPersons}
      testName={testName}
    />
  );
};
