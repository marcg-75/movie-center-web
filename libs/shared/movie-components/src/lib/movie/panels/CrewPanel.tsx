import '../movie.details.scss';
import React, { ChangeEvent, FormEvent, ReactNode, useState, } from 'react';
import { Loader } from '@giron/shared-ui-library';
import { RoleEnum, } from '@giron/data-access-redux';
import { CastAndCrewModel, IMovie, NameEntityModel, PersonRoleModel, SelectableModel, } from '@giron/shared-models';

type Props = {
  movie?: IMovie;
  crew?: PersonRoleModel[];
  persons?: NameEntityModel[];
  roles?: SelectableModel[];
  isMovieLoading?: boolean;
  isCrewLoading?: boolean;
  isPersonsLoading?: boolean;
  onMovieChange: (movie: IMovie) => void;
  errors?: string[] | Error[];
  testName?: string;
}

export const CrewPanel = ({
                            movie,
                            crew,
                            persons,
                            roles = [],
                            isMovieLoading,
                            isCrewLoading,
                            isPersonsLoading,
                            onMovieChange,
                            errors,
                            testName = 'CrewPanel_test',
                          }: Props) => {
  const [selectableCrewMembersForRole, setSelectableCrewMembersForRole] =
    useState<PersonRoleModel[]>([]);
  const [selectablePersonsForRole, setSelectablePersonsForRole] = useState<
    NameEntityModel[]
  >([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>();
  const [selectedPersonName, setSelectedPersonName] = useState<string>();

  const clearSelectedPerson = () => {
    setSelectablePersonsForRole([]);
    setSelectedPersonId(undefined);
    setSelectedPersonName(undefined);
  };

  const addCrewMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!crew || !movie) {
      return;
    }

    const roleCode: string = event.currentTarget['addCrewRole'].value;
    const crewPersonRoleId = event.currentTarget['crewPersonRoleId'].value;

    if (!(roleCode && crewPersonRoleId)) {
      alert('Både roll och person måste väljas.');
      return;
    }

    const role: RoleEnum = RoleEnum[roleCode as keyof typeof RoleEnum];
    const allCurrentPersonRolesForRole: Array<PersonRoleModel> =
      extractPersonRolesFromCrew(crew, role);
    const currentCrewMembers = existingMovieCrewMembersForRole(movie, role);
    const selectedCrewMember: PersonRoleModel | undefined =
      allCurrentPersonRolesForRole.find(
        (a: PersonRoleModel) => a.id === parseInt(crewPersonRoleId, 10)
      );

    const newCrewMember: CastAndCrewModel = {
      movieTitle: movie?.title || '',
      personRole: selectedCrewMember,
    } as CastAndCrewModel;

    currentCrewMembers.push(newCrewMember);

    const crewTypeName: string = getCrewTypeName(role);

    onMovieChange({
      ...movie,
      [crewTypeName]: currentCrewMembers,
    } as IMovie);

    event.currentTarget['addCrewRole'].value = '';
    event.currentTarget['crewPersonRoleId'].value = '';
  };

  const addNewCrewMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!persons) {
      return;
    }

    const roleCode: string = event.currentTarget['newCrewRole'].value;
    const personId = event.currentTarget['newCrewPersonId'].value;
    const personName = event.currentTarget['newCrewName'].value;

    if (!roleCode && (!personId || !personName)) {
      alert('Roll, befintlig person eller ny persons namn måste anges.');
      return;
    }

    // If a new name is given (not an existing person is selected), check if the name already exists.
    if (
      !personId &&
      persons.findIndex((p: NameEntityModel) => p.name === personName) > -1 &&
      !window.confirm(
        'En person med detta namn finns redan. Vill du skapa en ny person som har samma namn? Avbryt annars och välj befintlig person i listan intill.'
      )
    ) {
      event.currentTarget['newCrewName'].value = '';
      return;
    }

    const role: RoleEnum = RoleEnum[roleCode as keyof typeof RoleEnum];

    updateMovieCrewState(personId, personName, role);

    event.currentTarget['newCrewRole'].value = '';
    event.currentTarget['newCrewPersonId'].value = '';
    event.currentTarget['newCrewName'].value = '';

    clearSelectedPerson();
  };

  // Adds new crew member (existing or completely new PERSON)
  const updateMovieCrewState = (
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

    const role: SelectableModel = {
      code: RoleEnum[pRole],
    } as SelectableModel;

    const personRole: PersonRoleModel = {
      person,
      role,
    } as PersonRoleModel;

    const newCrewMember: CastAndCrewModel = {
      movieTitle: movie.title,
      personRole,
    } as CastAndCrewModel;

    crewMembers.push(newCrewMember);

    const crewTypeName: string = getCrewTypeName(pRole);

    if (crewTypeName) {
      onMovieChange({
        ...movie,
        [crewTypeName]: crewMembers,
      } as IMovie);
    }
  };

  const removeCrewMember = (
    cacId: number,
    personName: string,
    role: RoleEnum
  ) => {
    if (!movie) {
      return;
    }

    const rRole = roles?.find(
      (r: SelectableModel) => r.code === RoleEnum[role]
    );

    if (!window.confirm(`Vill du ta bort denna ${rRole?.name} från filmen?`)) {
      return;
    }

    const crewMembers = existingMovieCrewMembersForRole(movie, role);

    crewMembers.forEach((a: CastAndCrewModel) => {
      if (
        ((a.id && a.id === cacId) || !a.id) &&
        a.personRole.person.name === personName
      ) {
        a.deleted = true;
      }
    });

    const crewTypeName: string = getCrewTypeName(role);

    onMovieChange({
      ...movie,
      [crewTypeName]: crewMembers,
    } as IMovie);

    clearSelectedPerson();
  };

  const mapToElements = (crew: CastAndCrewModel[], role: RoleEnum) =>
    crew.map((cac: CastAndCrewModel, i: number) => (
      <div key={i} id={'' + cac.id} hidden={cac.deleted}>
        <span className="text-value">
          {cac.personRole.person ? cac.personRole.person.name : 'Namn saknas'}
        </span>

        {process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true' && (
          <button
            className="btn secondary"
            onClick={() =>
              removeCrewMember(cac.id, cac.personRole.person.name, role)
            }
          >
            Ta bort från film
          </button>
        )}
      </div>
    ));

  const getSelectableCrewMembersByRole = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRoleCode: string = event.target.value;
    let selectableCrewMembersForRole: Array<PersonRoleModel> = [];

    if (selectedRoleCode && selectedRoleCode.length && !!crew && !!movie) {
      const role: RoleEnum =
        RoleEnum[selectedRoleCode as keyof typeof RoleEnum];
      const currentCrewMembersForRole: CastAndCrewModel[] =
        existingMovieCrewMembersForRole(movie, role);

      // Filtrera bort alla personer som redan är tillagda för aktuell roll.
      const allSelectablePersonRolesForRole: Array<PersonRoleModel> =
        extractPersonRolesFromCrew(crew, role).filter(
          (personRole: PersonRoleModel) => {
            return (
              currentCrewMembersForRole.findIndex(
                (cac: CastAndCrewModel) => cac.personRole.id === personRole.id
              ) === -1
            );
          }
        );

      // selectableCrewMembersForRole = mapToOptionElements(allSelectablePersonRolesForRole);
      selectableCrewMembersForRole = allSelectablePersonRolesForRole;
    }

    setSelectableCrewMembersForRole(selectableCrewMembersForRole);
  };

  const getSelectablePersonsByRole = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRoleCode: string = event.target.value;
    let selectablePersonsForRole: Array<NameEntityModel> = [];

    if (
      persons &&
      persons.length > 0 &&
      selectedRoleCode &&
      selectedRoleCode.length &&
      !!movie
    ) {
      const role: RoleEnum =
        RoleEnum[selectedRoleCode as keyof typeof RoleEnum];
      const currentCrewMembersForRole: CastAndCrewModel[] =
        existingMovieCrewMembersForRole(movie, role);

      if (currentCrewMembersForRole?.length) {
        // Filtrera bort alla personer som redan är tillagda för aktuell roll.
        const allSelectablePersonsForRole: Array<NameEntityModel> =
          persons.filter((person: NameEntityModel) => {
            return (
              currentCrewMembersForRole.findIndex(
                (cac: CastAndCrewModel) =>
                  cac.personRole.person.id === person.id
              ) === -1
            );
          });

        // selectablePersonsForRole = mapToPersonOptionElements(allSelectablePersonsForRole);
        selectablePersonsForRole = allSelectablePersonsForRole;
      }
    }

    setSelectablePersonsForRole(selectablePersonsForRole);
  };

  const updateNewCrewName = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(event.target.value);
    setSelectedPersonName(event.target.selectedOptions[0].label);
  };

  let content: ReactNode;

  if (errors) {
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = (
      <div>
        <ul>
          {errors?.map((m, i: number) => (
            <li key={i}>{m as string}</li>
          ))}
        </ul>
      </div>
    );
  } else if (isMovieLoading || !movie || isCrewLoading || isPersonsLoading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader/>
      </div>
    );
  } else {
    const currentDirectorsInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.DIRECTOR);
    const currentProducersInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.PRODUCER);
    const currentComposersInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.MUSIC);
    const currentWritersInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.WRITER);
    const currentCastersInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.CASTING);
    const currentEditorsInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.EDITOR);
    const currentCinematographyInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.CINEMATOGRAPHY);
    const currentSoundInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.SOUND);
    const currentArtInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.ART);
    const currentOtherInMovie: CastAndCrewModel[] =
      existingMovieCrewMembersForRole(movie, RoleEnum.MISC);

    const directorElements: ReactNode[] = mapToElements(
      currentDirectorsInMovie,
      RoleEnum.DIRECTOR
    );
    const producerElements: ReactNode[] = mapToElements(
      currentProducersInMovie,
      RoleEnum.PRODUCER
    );
    const composerElements: ReactNode[] = mapToElements(
      currentComposersInMovie,
      RoleEnum.MUSIC
    );
    const writerElements: ReactNode[] = mapToElements(
      currentWritersInMovie,
      RoleEnum.WRITER
    );
    const casterElements: ReactNode[] = mapToElements(
      currentCastersInMovie,
      RoleEnum.CASTING
    );
    const editorElements: ReactNode[] = mapToElements(
      currentEditorsInMovie,
      RoleEnum.EDITOR
    );
    const cinematographyElements: ReactNode[] = mapToElements(
      currentCinematographyInMovie,
      RoleEnum.CINEMATOGRAPHY
    );
    const soundElements: ReactNode[] = mapToElements(
      currentSoundInMovie,
      RoleEnum.SOUND
    );
    const artElements: ReactNode[] = mapToElements(
      currentArtInMovie,
      RoleEnum.ART
    );
    const otherElements: ReactNode[] = mapToElements(
      currentOtherInMovie,
      RoleEnum.MISC
    );

    const allCrewRoleOptions: ReactNode[] = createAllCrewRoleOptions(roles);
    const crewMembersForRoleOptions: ReactNode[] =
      createSelectableCrewMembersForRole(selectableCrewMembersForRole);
    const personsForRoleOptions: ReactNode[] = createSelectablePersonsForRole(
      selectablePersonsForRole
    );

    const enableMovieInfoEdit =
      process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

    content = (
      <div className="panel-content">
        <h4>Regissör(er)</h4>
        {directorElements}

        <h4>Producent(er)</h4>
        {producerElements}

        <h4>Musik</h4>
        {composerElements}

        <h4>Manusförfattare</h4>
        {writerElements}

        {casterElements && casterElements.length > 0 && (
          <div>
            <h4>Rollbesättare</h4>
            {casterElements}
          </div>
        )}

        <h4>Redigerare</h4>
        {editorElements}

        <h4>Cinematografi</h4>
        {cinematographyElements}

        <h4>Ljud</h4>
        {soundElements}

        <h4>Konst</h4>
        {artElements}

        <h4>Övriga</h4>
        {otherElements}

        {enableMovieInfoEdit && (
          <form onSubmit={(e) => addCrewMember(e)} id="addCrewForm">
            <label>Lägg till medlem:</label>

            <select
              id="addCrewRole"
              name="addCrewRole"
              onChange={(e) => getSelectableCrewMembersByRole(e)}
            >
              {allCrewRoleOptions}
            </select>

            <select
              id="crewPersonRoleId"
              name="crewPersonRoleId"
              disabled={
                !selectableCrewMembersForRole ||
                !selectableCrewMembersForRole.length
              }
            >
              {crewMembersForRoleOptions}
            </select>

            <input type="submit" value="Lägg till"/>
          </form>
        )}

        {enableMovieInfoEdit && (
          <form onSubmit={(e) => addNewCrewMember(e)} id="addNewCrewMemberForm">
            <label>Lägg till ny medlem:</label>

            <select
              id="newCrewRole"
              name="newCrewRole"
              onChange={(e) => getSelectablePersonsByRole(e)}
            >
              {allCrewRoleOptions}
            </select>

            {isPersonsLoading ? (
              <Loader/>
            ) : (
              <select
                id="newCrewPersonId"
                name="crewPersonId"
                onChange={(e) => updateNewCrewName(e)}
                disabled={
                  !selectablePersonsForRole || !selectablePersonsForRole.length
                }
              >
                {personsForRoleOptions}
              </select>
            )}

            <input
              className="text-input-field"
              type="text"
              id="newCrewName"
              name="name"
              defaultValue={selectedPersonName}
              placeholder="Namn"
              disabled={
                selectedPersonId !== undefined && selectedPersonId.length > 0
              }
            />

            <input type="submit" value="Lägg till"/>
          </form>
        )}
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};

const createAllCrewRoleOptions = (
  roles: Array<SelectableModel>
): ReactNode[] => {
  if (!roles) {
    return [];
  }

  const crewRoles: Array<SelectableModel> = roles.filter(
    (role: SelectableModel) => role.code !== RoleEnum[RoleEnum.ACTOR]
  );

  const options: ReactNode[] = crewRoles.map(
    (option: SelectableModel, i: number) => {
      return (
        <option key={i + 1} value={option.code}>
          {option.name}
        </option>
      );
    }
  );
  options.unshift(<option key="0" value=""/>);

  return options;
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
  options.unshift(<option key="0" value=""/>);

  return options;
};

const createSelectablePersonsForRole = (
  persons: NameEntityModel[]
): ReactNode[] => {
  if (!persons) {
    return [];
  }

  const options: ReactNode[] = persons.map(
    (option: NameEntityModel, i: number) => {
      return (
        <option key={i + 1} value={option.id}>
          {option.name}
        </option>
      );
    }
  );
  options.unshift(<option key="0" value=""/>);

  return options;
};

const extractPersonRolesFromCrew = (
  crew: Array<PersonRoleModel>,
  role: RoleEnum
): Array<PersonRoleModel> => {
  if (!crew || !crew.length || !role) {
    return [];
  }

  // Extract
  const personRoles: Array<PersonRoleModel> = crew.filter(
    (item: PersonRoleModel) => item.role.code === RoleEnum[role]
  );

  // Sort
  return personRoles.sort((a: PersonRoleModel, b: PersonRoleModel) => {
    const nameA = a.person.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.person.name.toUpperCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
};

const existingMovieCrewMembersForRole = (
  movie: IMovie,
  role: RoleEnum
): CastAndCrewModel[] => {
  switch (role) {
    case RoleEnum.DIRECTOR:
      return movie.directors ? movie.directors : [];
    case RoleEnum.PRODUCER:
      return movie.producers ? movie.producers : [];
    case RoleEnum.MUSIC:
      return movie.music ? movie.music : [];
    case RoleEnum.WRITER:
      return movie.writers ? movie.writers : [];
    case RoleEnum.CASTING:
      return movie.casters ? movie.casters : [];
    case RoleEnum.EDITOR:
      return movie.editors ? movie.editors : [];
    case RoleEnum.CINEMATOGRAPHY:
      return movie.cinematography ? movie.cinematography : [];
    case RoleEnum.SOUND:
      return movie.sound ? movie.sound : [];
    case RoleEnum.ART:
      return movie.art ? movie.art : [];
    case RoleEnum.MISC:
      return movie.otherRoles ? movie.otherRoles : [];
    default:
      return [];
  }
};

export const mapToPersonOptionElements = (
  persons: Array<NameEntityModel>
): ReactNode[] => {
  if (!persons) {
    return [];
  }

  const options: ReactNode[] = persons.map(
    (option: NameEntityModel, i: number) => {
      return (
        <option key={i + 1} value={option.id}>
          {option.name}
        </option>
      );
    }
  );
  options.unshift(<option key={0} value=""/>);

  return options;
};

const getCrewTypeName = (role: RoleEnum): string => {
  switch (role) {
    case RoleEnum.DIRECTOR:
      return 'directors';
    case RoleEnum.PRODUCER:
      return 'producers';
    case RoleEnum.MUSIC:
      return 'music';
    case RoleEnum.WRITER:
      return 'writers';
    case RoleEnum.CASTING:
      return 'casters';
    case RoleEnum.EDITOR:
      return 'editors';
    case RoleEnum.CINEMATOGRAPHY:
      return 'cinematography';
    case RoleEnum.SOUND:
      return 'sound';
    case RoleEnum.ART:
      return 'art';
    case RoleEnum.MISC:
      return 'otherRoles';
    default:
      return '';
  }
};
