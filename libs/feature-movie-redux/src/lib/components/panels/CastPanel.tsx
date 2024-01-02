import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '@giron/shared-ui-library';
import {
  CastAndCrewModel,
  getActors,
  IMovie,
  MovieStateModel,
  PersonRoleModel,
  PersonStateModel,
  updateMovieState,
} from '@giron/data-access-redux';
import { mapToPersonOptionElements } from './CrewPanel';
import { NameEntityModel, SelectableModel } from '@giron/shared-models';

interface CastPanelProps {
  movie: MovieStateModel;
  person: PersonStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const CastPanel = ({
  movie,
  person,
  dispatch,
  testName = 'CastPanel_test',
}: CastPanelProps) => {
  const { movieItem } = movie;
  const { persons, actors, actorsLoading, personsLoading } = person;

  const [isActorsLoading, setIsActorsLoading] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [selectablePersons, setSelectablePersons] = useState<NameEntityModel[]>(
    []
  );
  const [selectedPersonId, setSelectedPersonId] = useState<string>();
  const [selectedPersonName, setSelectedPersonName] = useState<string>();

  useEffect(() => {
    if (
      !isActorsLoading &&
      ((!actorsLoading?.loading && !actorsLoading?.loaded) || !actors?.length)
    ) {
      setIsActorsLoading(true);
      dispatch(getActors());
    }
  }, []);

  useEffect(() => {
    setIsActorsLoading(actorsLoading?.loading);
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
    setSelectablePersons(getSelectablePersons());
  }, [movie, person]);

  const clearSelectedPerson = () => {
    setSelectablePersons([]);
    setSelectedPersonId(undefined);
    setSelectedPersonName(undefined);
  };

  const addActor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!movieItem) {
      return;
    }

    const actorPersonRoleId = event.currentTarget['actorPersonRoleId'].value;
    const characterName = event.currentTarget['characterName'].value;

    if (!(actorPersonRoleId && characterName)) {
      alert('Både skådespelare och rollfigurens namn måste anges.');
      return;
    }

    const allCurrentActors: Array<PersonRoleModel> = person.actors
      ? person.actors
      : [];
    const actorsForMovie = movieItem.actors ? movieItem.actors : [];
    const selectedActor: PersonRoleModel | undefined = allCurrentActors.find(
      (a: PersonRoleModel) => a.id === parseInt(actorPersonRoleId, 10)
    );

    const newActor: CastAndCrewModel = {
      movieTitle: movieItem.title,
      personRole: selectedActor,
      characterName,
    } as CastAndCrewModel;

    actorsForMovie.push(newActor);

    dispatch(
      updateMovieState({
        ...movieItem,
        actors: actorsForMovie,
      } as IMovie)
    );

    event.currentTarget['actorPersonRoleId'].value = '';
    event.currentTarget['characterName'].value = '';
  };

  const addNewActor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!persons) {
      return;
    }

    const personId = event.currentTarget['newActorPersonId'].value;
    const personName = event.currentTarget['newActorName'].value;
    const characterName = event.currentTarget['newActorCharacterName'].value;

    if ((!personId && !personName) || !characterName) {
      alert('Både skådespelarens och rollfigurens namn måste anges.');
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
      event.currentTarget['newActorName'].value = '';
      return;
    }

    updateMovieActorState(personId, personName, characterName);

    event.currentTarget['newActorPersonId'].value = '';
    event.currentTarget['newActorName'].value = '';
    event.currentTarget['newActorCharacterName'].value = '';

    clearSelectedPerson();

    dispatch(getActors());
  };

  // Adds new actor (existing or completely new PERSON)
  const updateMovieActorState = (
    personId: string,
    personName: string,
    characterName: string
  ) => {
    if (!movieItem || (!personId && !personName) || !characterName) {
      return;
    }

    const actors = movieItem.actors ? movieItem.actors : [];

    const person: NameEntityModel = {
      id: personId ? parseInt(personId, 10) : undefined,
      name: personName,
    } as NameEntityModel;

    const role: SelectableModel = {
      code: 'ACTOR',
    } as SelectableModel;

    const personRole: PersonRoleModel = {
      person,
      role,
    } as PersonRoleModel;

    const newActor: CastAndCrewModel = {
      movieTitle: movieItem.title,
      personRole,
      characterName,
    } as CastAndCrewModel;

    actors.push(newActor);

    dispatch(
      updateMovieState({
        ...movieItem,
        actors,
      } as IMovie)
    );
  };

  const removeActor = (actorId: number, personName: string) => {
    if (!movieItem) {
      return;
    }

    if (!window.confirm('Vill du ta bort denna skådespelare från filmen?')) {
      return;
    }

    const actorsForMovie = movieItem.actors ? movieItem.actors : [];

    //actorsForMovie = actorsForMovie.filter((a: CastAndCrewModel) => a.id !== actorId);

    actorsForMovie.forEach((a: CastAndCrewModel) => {
      if (
        (a.id && a.id === actorId) ||
        (!a.id && a.personRole.person.name === personName)
      ) {
        a.deleted = true;
      }
    });

    dispatch(
      updateMovieState({
        ...movieItem,
        actors: actorsForMovie,
      } as IMovie)
    );

    clearSelectedPerson();
  };

  const getSelectablePersons = (): NameEntityModel[] => {
    let selectablePersons: NameEntityModel[] = [];

    if (persons && persons.length > 0 && !!movieItem) {
      const currentActorsInMovie: Array<CastAndCrewModel> = movieItem.actors
        ? movieItem.actors
        : [];

      // Filtrera bort alla personer som redan är tillagda för aktuell roll.
      const allSelectablePersons: Array<NameEntityModel> = persons.filter(
        (person: NameEntityModel) => {
          return (
            currentActorsInMovie.findIndex(
              (cac: CastAndCrewModel) => cac.personRole.person.id === person.id
            ) === -1
          );
        }
      );
      selectablePersons = allSelectablePersons;

      // selectablePersons = mapToPersonOptionElements(allSelectablePersons);
    }

    return selectablePersons;
  };

  const updateNewActorName = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(event.target.value);
    setSelectedPersonName(event.target.selectedOptions[0].label);
  };

  let content;

  if (actorsLoading?.errors || personsLoading?.errors) {
    //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = (
      <div>
        <ul>
          {actorsLoading?.errors?.map((m, i: number) => (
            <li key={i}>{m as string}</li>
          ))}
        </ul>
      </div>
    );
  } else if (isMovieLoading || !movieItem || actorsLoading?.loading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const allCurrentActors: Array<PersonRoleModel> = actors ? actors : [];
    const currentActorsInMovie: Array<CastAndCrewModel> = movieItem.actors
      ? movieItem.actors
      : [];

    const castElements = currentActorsInMovie.map(
      (actor: CastAndCrewModel, i: number) => (
        <div key={i} id={'' + actor.id} hidden={actor.deleted}>
          <span className="text-value">
            {actor.personRole.person
              ? actor.personRole.person.name
              : 'Namn saknas'}
          </span>
          <span className="text-value">{actor.characterName}</span>

          {process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true' && (
            <button
              className="btn secondary"
              onClick={() =>
                removeActor(actor.id, actor.personRole.person.name)
              }
            >
              Ta bort från film
            </button>
          )}
        </div>
      )
    );

    const currentActorOptions: ReactNode[] = allCurrentActors.map(
      (option: PersonRoleModel, i: number) => {
        return (
          <option key={i + 1} value={option.id}>
            {option.person.name}
          </option>
        );
      }
    );
    currentActorOptions.unshift(<option key="0" value=""></option>);

    const selectablePersonOptions: ReactNode[] =
      mapToPersonOptionElements(selectablePersons);

    const enableMovieInfoEdit = process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

    content = (
      <div>
        {castElements}

        {enableMovieInfoEdit && (
          <form onSubmit={(e) => addActor(e)} id="addActorForm">
            <label>Lägg till skådespelare:</label>
            <select id="addActor" name="actorPersonRoleId">
              {currentActorOptions}
            </select>
            <input
              className="text-input-field"
              type="text"
              id="actorCharacterName"
              name="characterName"
              placeholder="Rollnamn"
            />
            <input type="submit" value="Lägg till" />
          </form>
        )}

        {enableMovieInfoEdit && (
          <form onSubmit={(e) => addNewActor(e)} id="addNewActorForm">
            <label>Lägg till ny skådespelare:</label>

            {!personsLoading || personsLoading.loading ? (
              <Loader />
            ) : (
              <select
                id="newActorPersonId"
                name="newActorPersonId"
                onChange={(e) => updateNewActorName(e)}
                disabled={!selectablePersons || !selectablePersons.length}
              >
                {selectablePersonOptions}
              </select>
            )}

            <input
              className="text-input-field"
              type="text"
              id="newActorName"
              name="name"
              defaultValue={selectedPersonName}
              placeholder="Name"
              disabled={
                selectedPersonId !== undefined && selectedPersonId.length > 0
              }
            />

            <input
              className="text-input-field"
              type="text"
              id="newActorCharacterName"
              name="characterName"
              placeholder="Rollnamn"
            />

            <input type="submit" value="Lägg till" />
          </form>
        )}
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};

function stateToProps({
  movie,
  person,
}: {
  movie: MovieStateModel;
  person: PersonStateModel;
}) {
  return {
    movie,
    person,
  };
}

export default connect(stateToProps)(CastPanel);
