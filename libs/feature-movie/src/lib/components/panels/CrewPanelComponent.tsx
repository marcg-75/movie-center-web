import { IMovie } from '@giron/shared-models';
import { CrewPanel } from '@giron/shared-movie-components';
import { useAllPersons, useCrew, useRoles } from '@giron/data-access';
import { Control, UseFormSetValue } from 'react-hook-form';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  loadAllPersons?: boolean;
  setValue: UseFormSetValue<IMovie>;
  testName?: string;
};

export const CrewPanelComponent = ({
  movie,
  isMovieLoading,
  loadAllPersons = false,
  setValue,
  testName = 'CrewPanelComponent_test',
}: Props) => {
  const { crew, isCrewLoading, error: crewError } = useCrew();
  const {
    persons,
    isPersonsLoading,
    error: personsError,
  } = useAllPersons(loadAllPersons);
  const { roles, isRolesLoading, error: rolesError } = useRoles();

  return (
    <CrewPanel
      setValue={setValue}
      movie={movie}
      crew={crew}
      persons={persons}
      roles={roles}
      isMovieLoading={isMovieLoading || isRolesLoading}
      isCrewLoading={isCrewLoading}
      isPersonsLoading={isPersonsLoading}
      error={crewError || personsError || rolesError}
      enableSelectFromAllPersons={loadAllPersons}
      testName={testName}
    />
  );
};
