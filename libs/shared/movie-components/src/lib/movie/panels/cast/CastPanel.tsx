import '../../movie.details.scss';
import React, { MouseEvent, useEffect, useState } from 'react';
import { Loader } from '@giron/shared-ui-library';
import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  PersonRoleModel,
} from '@giron/shared-models';
import { UseFormSetValue } from 'react-hook-form';
import { AddActor } from './AddActor';
import { sortPersonRoles } from '../../utils/person.utils';
import { AddNewActor } from './AddNewActor';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

type Props = {
  movie?: IMovie;
  actors?: PersonRoleModel[];
  persons?: NameEntityModel[];
  isMovieLoading?: boolean;
  isActorsLoading?: boolean;
  isPersonsLoading?: boolean;
  setValue: UseFormSetValue<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  enableSelectFromAllPersons?: boolean;
  testName?: string;
};

export const CastPanel = ({
  movie,
  actors,
  persons,
  isMovieLoading = false,
  isActorsLoading = false,
  isPersonsLoading = false,
  setValue,
  error,
  errors,
  enableSelectFromAllPersons = false,
  testName = 'CastPanel_test',
}: Props) => {
  const [actorsInMovie, setActorsInMovie] = useState<CastAndCrewModel[]>(
    movie?.actors || []
  );
  const [selectableActors, setSelectableActors] = useState<PersonRoleModel[]>(
    []
  );

  useEffect(() => {
    if (actors) {
      setSelectableActors(sortPersonRoles(actors));
    }
  }, [actors]);

  const updateActors = (actors: CastAndCrewModel[]) => {
    setValue('actors', actors);
    setActorsInMovie([...actors]);
  };

  const removeActor = (
    event: MouseEvent<HTMLButtonElement>,
    actorId: number,
    personName: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!movie) {
      return;
    }

    if (!window.confirm('Vill du ta bort denna skådespelare från filmen?')) {
      return;
    }

    const actorsForMovie = movie.actors ? movie.actors : [];

    actorsForMovie.forEach((a: CastAndCrewModel) => {
      if (
        (a.id && a.id === actorId) ||
        (!a.id && a.personRole.person.name === personName)
      ) {
        a.deleted = true;
      }
    });

    updateActors(actorsForMovie);
  };

  let content;

  if (error) {
    content = (
      <div>
        <ul>
          <li>
            {typeof error === 'string' ? error : (error as Error).message}
          </li>
        </ul>
      </div>
    );
  } else if (errors) {
    //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
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
  } else if (isMovieLoading || isActorsLoading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const castElements = actorsInMovie.map(
      (actor: CastAndCrewModel, i: number) => (
        <div key={i} id={'' + actor.id} hidden={actor.deleted}>
          <span className="text-value">
            {actor.personRole.person
              ? actor.personRole.person.name
              : 'Namn saknas'}
          </span>
          <span className="text-value">{actor.characterName}</span>

          {enableMovieInfoEdit && (
            <button
              className="btn secondary"
              onClick={(e) =>
                removeActor(e, actor.id, actor.personRole.person.name)
              }
            >
              Ta bort från film
            </button>
          )}
        </div>
      )
    );

    content = (
      <div className="panel-content">
        {castElements}

        {enableMovieInfoEdit && (
          <>
            <AddActor
              movie={movie}
              actors={selectableActors}
              onAddActors={updateActors}
            />

            <AddNewActor
              movie={movie}
              persons={persons}
              isPersonsLoading={isPersonsLoading}
              enableSelectFromAllPersons={enableSelectFromAllPersons}
              onAddActors={updateActors}
            />
          </>
        )}
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
