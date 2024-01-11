import {
  CastAndCrewModel,
  IMovie,
  PersonRoleModel,
} from '@giron/shared-models';
import { MouseEvent, ReactNode, useState } from 'react';

type Props = {
  movie?: IMovie;
  actors?: PersonRoleModel[];
  onAddActors: (actors: CastAndCrewModel[]) => void;
};

export const AddActor = ({ movie, actors, onAddActors }: Props) => {
  const [actorPersonRoleIdToAdd, setActorPersonRoleIdToAdd] =
    useState<string>('');
  const [characterNameToAdd, setCharacterNameToAdd] = useState<string>('');

  const addActor = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!movie) {
      return;
    }

    if (!(actorPersonRoleIdToAdd?.length && characterNameToAdd?.length)) {
      alert('Både skådespelare och rollfigurens namn måste anges.');
      return;
    }

    const allCurrentActors: PersonRoleModel[] = actors ? actors : [];
    const actorsForMovie: CastAndCrewModel[] = movie.actors ? movie.actors : [];
    const selectedActor: PersonRoleModel | undefined = allCurrentActors.find(
      (a: PersonRoleModel) => a.id === parseInt(actorPersonRoleIdToAdd, 10)
    );

    const newActor: CastAndCrewModel = {
      movieTitle: movie.title,
      personRole: selectedActor,
      characterName: characterNameToAdd,
    } as CastAndCrewModel;

    actorsForMovie.push(newActor);

    onAddActors(actorsForMovie);

    setActorPersonRoleIdToAdd('');
    setCharacterNameToAdd('');
  };

  const allCurrentActors: PersonRoleModel[] = actors ? actors : [];

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

  return (
    <div>
      <label>Lägg till skådespelare:</label>
      <select
        value={actorPersonRoleIdToAdd}
        onChange={(e) => setActorPersonRoleIdToAdd(e.target.value)}
      >
        {currentActorOptions}
      </select>

      <input
        className="text-input-field"
        type="text"
        id="actorCharacterName"
        name="characterName"
        placeholder="Rollnamn"
        value={characterNameToAdd}
        onChange={(e) => {
          e.preventDefault();
          setCharacterNameToAdd(e.target.value);
        }}
      />
      <button onClick={(e) => addActor(e)}>Lägg till</button>
    </div>
  );
};
