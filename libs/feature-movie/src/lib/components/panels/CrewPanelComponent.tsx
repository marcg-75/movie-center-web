import { IMovie } from '@giron/shared-models';
import { CrewPanel } from '@giron/shared-movie-components';
import { useAllPersons, useCrew, useRoles } from '@giron/data-access';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  loadAllPersons?: boolean;
  testName?: string;
};

export const CrewPanelComponent = ({
  movie,
  isMovieLoading,
  loadAllPersons = false,
  testName = 'CrewPanelComponent_test',
}: Props) => {
  const { crew, isCrewLoading, error: crewError } = useCrew();
  const {
    persons,
    isPersonsLoading,
    error: personsError,
  } = useAllPersons(loadAllPersons);
  const { roles, isRolesLoading, error: rolesError } = useRoles();

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <CrewPanel
      movie={movie}
      crew={crew}
      persons={persons}
      roles={roles}
      isMovieLoading={isMovieLoading || isRolesLoading}
      isCrewLoading={isCrewLoading}
      isPersonsLoading={isPersonsLoading}
      onMovieChange={notYetImplemented}
      error={crewError || personsError || rolesError}
      enableSelectFromAllPersons={loadAllPersons}
      testName={testName}
    />
  );
};
