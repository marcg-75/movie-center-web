import '../../movie.details.scss';
import React, { MouseEvent, ReactNode, useState } from 'react';
import { Loader } from '@giron/shared-ui-library';
import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  PersonRoleModel,
  RoleEnum,
  SelectableModel,
} from '@giron/shared-models';
import { UseFormSetValue } from 'react-hook-form';
import { existingMovieCrewMembersForRole } from '../../utils/person.utils';
import { AddCrewMember } from './AddCrewMember';
import { AddNewCrewMember } from './AddNewCrewMember';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

type Props = {
  movie?: IMovie;
  crew?: PersonRoleModel[];
  persons?: NameEntityModel[];
  roles?: SelectableModel[];
  isMovieLoading?: boolean;
  isCrewLoading?: boolean;
  isPersonsLoading?: boolean;
  setValue: UseFormSetValue<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  enableSelectFromAllPersons?: boolean;
  testName?: string;
};

export const CrewPanel = ({
  movie,
  crew,
  persons,
  roles = [],
  isMovieLoading,
  isCrewLoading,
  isPersonsLoading,
  setValue,
  error,
  errors,
  enableSelectFromAllPersons,
  testName = 'CrewPanel_test',
}: Props) => {
  const [casters, setCasters] = useState<CastAndCrewModel[]>(
    movie?.casters || []
  );
  const [cinematography, setCinematography] = useState<CastAndCrewModel[]>(
    movie?.cinematography || []
  );
  const [directors, setDirectors] = useState<CastAndCrewModel[]>(
    movie?.directors || []
  );
  const [editors, setEditors] = useState<CastAndCrewModel[]>(
    movie?.editors || []
  );
  const [misc, setMisc] = useState<CastAndCrewModel[]>(movie?.otherRoles || []);
  const [music, setMusic] = useState<CastAndCrewModel[]>(movie?.music || []);
  const [producers, setProducers] = useState<CastAndCrewModel[]>(
    movie?.producers || []
  );
  const [sound, setSound] = useState<CastAndCrewModel[]>(movie?.sound || []);
  const [writers, setWriters] = useState<CastAndCrewModel[]>(
    movie?.writers || []
  );
  const [art, setArt] = useState<CastAndCrewModel[]>(movie?.art || []);

  const updateCrewMembers = (
    role: RoleEnum,
    crewMembers: CastAndCrewModel[]
  ) => {
    switch (role) {
      case RoleEnum.CASTING:
        setValue('casters', crewMembers);
        return setCasters([...crewMembers]);
      case RoleEnum.CINEMATOGRAPHY:
        setValue('cinematography', crewMembers);
        return setCinematography([...crewMembers]);
      case RoleEnum.DIRECTOR:
        setValue('directors', crewMembers);
        return setDirectors([...crewMembers]);
      case RoleEnum.EDITOR:
        setValue('editors', crewMembers);
        return setEditors([...crewMembers]);
      case RoleEnum.MISC:
        setValue('otherRoles', crewMembers);
        return setMisc([...crewMembers]);
      case RoleEnum.MUSIC:
        setValue('music', crewMembers);
        return setMusic([...crewMembers]);
      case RoleEnum.PRODUCER:
        setValue('producers', crewMembers);
        return setProducers([...crewMembers]);
      case RoleEnum.SOUND:
        setValue('sound', crewMembers);
        return setSound([...crewMembers]);
      case RoleEnum.WRITER:
        setValue('writers', crewMembers);
        return setWriters([...crewMembers]);
      case RoleEnum.ART:
        setValue('art', crewMembers);
        return setArt([...crewMembers]);
      default:
        console.error(`Could not add crew member. Bad role ${role} given.`);
    }
  };

  const removeCrewMember = (
    event: MouseEvent<HTMLButtonElement>,
    cacId: number,
    personName: string,
    role: RoleEnum
  ) => {
    event.preventDefault();
    event.stopPropagation();

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

    updateCrewMembers(role, crewMembers);
  };

  const mapToElements = (
    crew: CastAndCrewModel[],
    role: RoleEnum
  ): ReactNode[] =>
    crew
      .filter((cac: CastAndCrewModel) => !cac.deleted)
      .map((cac: CastAndCrewModel, i: number) => {
        return (
          <div key={i} id={'' + cac.id} hidden={cac.deleted}>
            <span className="text-value">
              {cac.personRole.person
                ? cac.personRole.person.name
                : 'Namn saknas'}
            </span>

            {enableMovieInfoEdit && (
              <button
                className="btn secondary"
                onClick={(e) =>
                  removeCrewMember(e, cac.id, cac.personRole.person.name, role)
                }
              >
                Ta bort från film
              </button>
            )}
          </div>
        );
      });

  let content: ReactNode;

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
        <Loader />
      </div>
    );
  } else {
    const directorElements: ReactNode[] = mapToElements(
      directors,
      RoleEnum.DIRECTOR
    );
    const producerElements: ReactNode[] = mapToElements(
      producers,
      RoleEnum.PRODUCER
    );
    const composerElements: ReactNode[] = mapToElements(music, RoleEnum.MUSIC);
    const writerElements: ReactNode[] = mapToElements(writers, RoleEnum.WRITER);
    const casterElements: ReactNode[] = mapToElements(
      casters,
      RoleEnum.CASTING
    );
    const editorElements: ReactNode[] = mapToElements(editors, RoleEnum.EDITOR);
    const cinematographyElements: ReactNode[] = mapToElements(
      cinematography,
      RoleEnum.CINEMATOGRAPHY
    );
    const soundElements: ReactNode[] = mapToElements(sound, RoleEnum.SOUND);
    const artElements: ReactNode[] = mapToElements(art, RoleEnum.ART);
    const otherElements: ReactNode[] = mapToElements(misc, RoleEnum.MISC);

    const allCrewRoleOptions: ReactNode[] = createAllCrewRoleOptions(roles);

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
          <>
            <AddCrewMember
              movie={movie}
              crew={crew}
              allCrewRoleOptions={allCrewRoleOptions}
              onAddCrewMember={updateCrewMembers}
            />

            <AddNewCrewMember
              movie={movie}
              persons={persons}
              allCrewRoleOptions={allCrewRoleOptions}
              enableSelectFromAllPersons={enableSelectFromAllPersons}
              onAddCrewMember={updateCrewMembers}
            />
          </>
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
  options.unshift(<option key="0" value="" />);

  return options;
};
