import {
  CastAndCrewModel,
  IMovie,
  PersonRoleModel,
  RoleEnum,
} from '@giron/shared-models';
import React, { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import {
  existingMovieCrewMembersForRole,
  sortPersonRoles,
} from '../../utils/person.utils';

type Props = {
  movie?: IMovie;
  crew?: PersonRoleModel[];
  allCrewRoleOptions: ReactNode[];
  onAddCrewMember: (role: RoleEnum, crewMembers: CastAndCrewModel[]) => void;
};

export const AddCrewMember = ({
  movie,
  crew,
  allCrewRoleOptions,
  onAddCrewMember,
}: Props) => {
  const [selectableCrewMembersForRole, setSelectableCrewMembersForRole] =
    useState<PersonRoleModel[]>([]);
  const crewMembersForRoleOptions: ReactNode[] =
    createSelectableCrewMembersForRole(selectableCrewMembersForRole);

  const [roleCodeToAdd, setRoleCodeToAdd] = useState<string>('');
  const [crewPersonRoleIdToAdd, setCrewPersonRoleIdToAdd] =
    useState<string>('');

  const getSelectableCrewMembersByRole = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const roleCode: string = event.target.value;
    let selectableCrewMembersForRole: PersonRoleModel[] = [];

    if (roleCode && roleCode.length && !!crew && !!movie) {
      const role: RoleEnum = RoleEnum[roleCode as keyof typeof RoleEnum];
      const currentCrewMembersForRole: CastAndCrewModel[] =
        existingMovieCrewMembersForRole(movie, role);

      // Filtrera bort alla personer som redan är tillagda för aktuell roll.
      selectableCrewMembersForRole = extractPersonRolesFromCrew(
        crew,
        role
      ).filter(
        (personRole: PersonRoleModel) =>
          currentCrewMembersForRole.findIndex(
            (cac) => cac.personRole.id === personRole.id
          ) === -1
      );
    }

    setRoleCodeToAdd(roleCode);
    setSelectableCrewMembersForRole(selectableCrewMembersForRole);
  };

  const addCrewMember = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!crew || !movie) {
      return;
    }

    if (!(roleCodeToAdd?.length && crewPersonRoleIdToAdd?.length)) {
      alert('Både roll och person måste väljas.');
      return;
    }

    const role: RoleEnum = RoleEnum[roleCodeToAdd as keyof typeof RoleEnum];
    const currentCrewMembers = existingMovieCrewMembersForRole(movie, role);
    const selectedCrewMember: PersonRoleModel | undefined =
      selectableCrewMembersForRole.find(
        (a: PersonRoleModel) =>
          a.person.id === parseInt(crewPersonRoleIdToAdd, 10)
      );

    const newCrewMember: CastAndCrewModel = {
      movieTitle: movie?.title || '',
      personRole: selectedCrewMember,
    } as CastAndCrewModel;

    currentCrewMembers.push(newCrewMember);

    onAddCrewMember(role, currentCrewMembers);

    setRoleCodeToAdd('');
    setCrewPersonRoleIdToAdd('');
  };

  return (
    <div>
      <label>Lägg till medlem:</label>

      <select
        value={roleCodeToAdd}
        onChange={(e) => getSelectableCrewMembersByRole(e)}
      >
        {allCrewRoleOptions}
      </select>

      <select
        value={crewPersonRoleIdToAdd}
        disabled={
          !selectableCrewMembersForRole || !selectableCrewMembersForRole.length
        }
        onChange={(e) => setCrewPersonRoleIdToAdd(e.target.value)}
      >
        {crewMembersForRoleOptions}
      </select>

      <button onClick={(e) => addCrewMember(e)}>Lägg till</button>
    </div>
  );
};

const extractPersonRolesFromCrew = (
  crew: PersonRoleModel[],
  role: RoleEnum
): PersonRoleModel[] => {
  if (!crew || !crew.length || !role) {
    return [];
  }

  // Extract
  const personRoles: PersonRoleModel[] = crew.filter(
    (item: PersonRoleModel) => item.role.code === RoleEnum[role]
  );

  // Sort
  return sortPersonRoles(personRoles);
};

const createSelectableCrewMembersForRole = (
  personRoles: PersonRoleModel[]
): ReactNode[] => {
  if (!personRoles) {
    return [];
  }

  const options: ReactNode[] = personRoles.map(
    (option: PersonRoleModel, i: number) => {
      return (
        <option key={i + 1} value={option.person.id}>
          {option.person.name}
        </option>
      );
    }
  );
  options.unshift(<option key="0" value="" />);

  return options;
};
