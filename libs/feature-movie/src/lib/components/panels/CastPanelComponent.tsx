import { IMovie } from '@giron/shared-models';
import { CastPanel } from '@giron/shared-movie-components';
import { useActors, useAllPersons } from '@giron/data-access';
import { UseFormSetValue } from 'react-hook-form';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  loadAllPersons?: boolean;
  setValue: UseFormSetValue<IMovie>;
  testName?: string;
};

export const CastPanelComponent = ({
  movie,
  isMovieLoading,
  loadAllPersons = false,
  setValue,
  testName = 'CastPanelComponent_test',
}: Props) => {
  const { actors, isActorsLoading, error: actorsError } = useActors();
  const {
    persons,
    isPersonsLoading,
    error: personsError,
  } = useAllPersons(loadAllPersons);

  return (
    <CastPanel
      setValue={setValue}
      movie={movie}
      actors={actors}
      persons={persons}
      isMovieLoading={isMovieLoading}
      isActorsLoading={isActorsLoading}
      isPersonsLoading={isPersonsLoading}
      error={actorsError || personsError}
      enableSelectFromAllPersons={loadAllPersons}
      testName={testName}
    />
  );
};
