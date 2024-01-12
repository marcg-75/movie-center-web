import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  PersonRoleModel,
  SelectableModel,
} from '@giron/shared-models';
import { Loader } from '@giron/shared-ui-library';
import React, {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { mapToPersonOptionElements } from '../../utils/person.utils';

type Props = {
  movie?: IMovie;
  persons?: NameEntityModel[];
  isPersonsLoading?: boolean;
  enableSelectFromAllPersons?: boolean;
  onAddActors: (actors: CastAndCrewModel[]) => void;
};

export const AddNewActor = ({
  movie,
  persons = [],
  isPersonsLoading,
  enableSelectFromAllPersons,
  onAddActors,
}: Props) => {
  const [selectablePersons, setSelectablePersons] = useState<NameEntityModel[]>(
    []
  );

  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [selectedPersonName, setSelectedPersonName] = useState<string>('');
  const [selectedCharacterName, setSelectedCharacterName] =
    useState<string>('');

  useEffect(() => {
    getSelectablePersons();
  }, [movie, persons]);

  const selectablePersonOptions: ReactNode[] =
    mapToPersonOptionElements(selectablePersons);

  const clearSelectedPerson = () => {
    setSelectablePersons([]);
    setSelectedPersonId('');
    setSelectedPersonName('');
    setSelectedCharacterName('');
  };

  const addNewActor = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!persons) {
      return;
    }

    if (
      (!selectedPersonId?.length && !selectedPersonName?.length) ||
      !selectedCharacterName?.length
    ) {
      alert('Både skådespelarens och rollfigurens namn måste anges.');
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

    updateMovieActors(
      selectedPersonId,
      selectedPersonName,
      selectedCharacterName
    );

    setSelectedPersonId('');
    setSelectedPersonName('');
    setSelectedCharacterName('');

    clearSelectedPerson();
  };

  // Adds new actor (existing or completely new PERSON)
  const updateMovieActors = (
    personId: string,
    personName: string,
    characterName: string
  ) => {
    if (!movie || (!personId && !personName) || !characterName) {
      return;
    }

    const actors = movie.actors ? movie.actors : [];

    const person: NameEntityModel = {
      id: personId ? parseInt(personId, 10) : undefined,
      name: personName,
    } as NameEntityModel;

    const role: SelectableModel = { code: 'ACTOR' } as SelectableModel;
    const personRole: PersonRoleModel = { person, role } as PersonRoleModel;

    const newActor: CastAndCrewModel = {
      movieTitle: movie.title,
      personRole,
      characterName,
    } as CastAndCrewModel;

    actors.push(newActor);

    onAddActors(actors);
  };

  const getSelectablePersons = () => {
    if (
      enableSelectFromAllPersons &&
      persons &&
      persons.length > 0 &&
      !!movie
    ) {
      const currentActorsInMovie: Array<CastAndCrewModel> = movie.actors
        ? movie.actors
        : [];
      let selectablePersons: NameEntityModel[] = [];

      if (currentActorsInMovie?.length) {
        // Filtrera bort alla personer som redan är tillagda för aktuell roll.
        selectablePersons = persons.filter((person: NameEntityModel) => {
          return (
            currentActorsInMovie.findIndex(
              (cac: CastAndCrewModel) => cac.personRole.person.id === person.id
            ) === -1
          );
        });
      }
      setSelectablePersons(selectablePersons);
    }
  };

  const setSelectedPerson = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(event.target.value);
    setSelectedPersonName(event.target.selectedOptions[0].label);
  };

  return (
    <div>
      <label>Lägg till ny skådespelare:</label>

      {enableSelectFromAllPersons &&
        (isPersonsLoading ? (
          <Loader />
        ) : (
          <select
            id="newActorPersonId"
            name="newActorPersonId"
            value={selectedPersonId}
            onChange={(e) => setSelectedPerson(e)}
            disabled={!selectablePersons || !selectablePersons.length}
          >
            {selectablePersonOptions}
          </select>
        ))}

      <input
        className="text-input-field"
        type="text"
        id="newActorName"
        name="name"
        placeholder="Name"
        value={selectedPersonName}
        disabled={selectedPersonId !== undefined && selectedPersonId.length > 0}
        onChange={(e) => {
          e.preventDefault();
          setSelectedPersonName(e.target.value);
        }}
      />

      <input
        className="text-input-field"
        type="text"
        id="newActorCharacterName"
        name="characterName"
        placeholder="Rollnamn"
        value={selectedCharacterName}
        onChange={(e) => {
          e.preventDefault();
          setSelectedCharacterName(e.target.value);
        }}
      />

      <button onClick={(e) => addNewActor(e)}>Lägg till</button>
    </div>
  );
};
