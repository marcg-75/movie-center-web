import React, { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  PersonRoleModel,
  RoleEnum,
  SelectableModel,
} from '@giron/shared-models';
import { Loader } from '@giron/shared-ui-library';
import {
  existingMovieCrewMembersForRole,
  mapToPersonOptionElements,
} from '../../utils/person.utils';

type Props = {
  movie?: IMovie;
  persons?: NameEntityModel[];
  allCrewRoleOptions: ReactNode[];
  isPersonsLoading?: boolean;
  enableSelectFromAllPersons?: boolean;
  onAddCrewMember: (role: RoleEnum, crewMembers: CastAndCrewModel[]) => void;
};

export const AddNewCrewMember = ({
  movie,
  persons = [],
  allCrewRoleOptions,
  isPersonsLoading,
  enableSelectFromAllPersons,
  onAddCrewMember,
}: Props) => {
  const [selectablePersonsForRole, setSelectablePersonsForRole] = useState<
    NameEntityModel[]
  >([]);

  const [roleCodeToAdd, setRoleCodeToAdd] = useState<string>();
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [selectedPersonName, setSelectedPersonName] = useState<string>('');

  const personsForRoleOptions: ReactNode[] = mapToPersonOptionElements(
    selectablePersonsForRole
  );

  const clearSelectedPerson = () => {
    setSelectablePersonsForRole([]);
    setSelectedPersonId('');
    setSelectedPersonName('');
  };

  const addNewCrewMember = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!persons) {
      return;
    }

    if (
      !roleCodeToAdd?.length &&
      (!selectedPersonId?.length || !selectedPersonName?.length)
    ) {
      alert('Roll, befintlig person eller ny persons namn måste anges.');
      return;
    }

    // If a new name is given (not an existing person is selected), check if the name already exists.
    if (
      !selectedPersonId?.length &&
      persons.findIndex((p: NameEntityModel) => p.name === selectedPersonName) >
        -1 &&
      !window.confirm(
        'En person med detta namn finns redan. Vill du skapa en ny person som har samma namn? Avbryt annars och välj befintlig person i listan intill.'
      )
    ) {
      setSelectedPersonName('');
      return;
    }

    const role: RoleEnum = RoleEnum[roleCodeToAdd as keyof typeof RoleEnum];

    updateMovieCrew(selectedPersonId, selectedPersonName, role);

    setRoleCodeToAdd('');
    setSelectedPersonId('');
    setSelectedPersonName('');

    clearSelectedPerson();
  };

  // Adds new crew member (existing or completely new PERSON)
  const updateMovieCrew = (
    personId: string,
    personName: string,
    pRole: RoleEnum
  ) => {
    if (!movie || (!personId && !personName)) {
      return;
    }

    const crewMembers = existingMovieCrewMembersForRole(movie, pRole);

    const person: NameEntityModel = {
      id: personId ? parseInt(personId, 10) : undefined,
      name: personName,
    } as NameEntityModel;

    const role: SelectableModel = { code: RoleEnum[pRole] } as SelectableModel;
    const personRole: PersonRoleModel = { person, role } as PersonRoleModel;

    const newCrewMember: CastAndCrewModel = {
      movieTitle: movie.title,
      personRole,
    } as CastAndCrewModel;

    crewMembers.push(newCrewMember);

    onAddCrewMember(pRole, crewMembers);
  };

  const getSelectablePersonsByRole = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const roleCode: string = event.target.value;

    if (
      enableSelectFromAllPersons &&
      persons &&
      persons.length > 0 &&
      roleCode &&
      roleCode.length &&
      !!movie
    ) {
      const role: RoleEnum = RoleEnum[roleCode as keyof typeof RoleEnum];
      const currentCrewMembersForRole: CastAndCrewModel[] =
        existingMovieCrewMembersForRole(movie, role);
      let selectablePersonsForRole: Array<NameEntityModel> = [];

      if (currentCrewMembersForRole?.length) {
        // Filtrera bort alla personer som redan är tillagda för aktuell roll.
        selectablePersonsForRole = persons.filter((person: NameEntityModel) => {
          return (
            currentCrewMembersForRole.findIndex(
              (cac: CastAndCrewModel) => cac.personRole.person.id === person.id
            ) === -1
          );
        });
      }
      setSelectablePersonsForRole(selectablePersonsForRole);
    }

    setRoleCodeToAdd(roleCode);
  };

  const setSelectedPerson = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(event.target.value);
    setSelectedPersonName(event.target.selectedOptions[0].label);
  };

  return (
    <div>
      <label>Lägg till ny medlem:</label>

      <select
        id="newCrewRole"
        name="newCrewRole"
        onChange={(e) => getSelectablePersonsByRole(e)}
      >
        {allCrewRoleOptions}
      </select>

      {enableSelectFromAllPersons &&
        (isPersonsLoading ? (
          <Loader />
        ) : (
          <select
            id="newCrewPersonId"
            name="crewPersonId"
            onChange={(e) => setSelectedPerson(e)}
            disabled={
              !selectablePersonsForRole || !selectablePersonsForRole.length
            }
          >
            {personsForRoleOptions}
          </select>
        ))}

      <input
        className="text-input-field"
        type="text"
        id="newCrewName"
        name="name"
        defaultValue={selectedPersonName}
        placeholder="Namn"
        disabled={selectedPersonId !== undefined && selectedPersonId.length > 0}
        onChange={(e) => {
          e.preventDefault();
          setSelectedPersonName(e.target.value);
        }}
      />

      <button onClick={(e) => addNewCrewMember(e)}>Lägg till</button>
    </div>
  );
};
