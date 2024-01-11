import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  PersonRoleModel,
  RoleEnum,
} from '@giron/shared-models';
import React, { ReactNode } from 'react';

export const existingMovieCrewMembersForRole = (
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

export const getCrewTypeName = (role: RoleEnum): string => {
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

export const sortPersonRoles = (
  personRoles: PersonRoleModel[]
): PersonRoleModel[] => {
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

export const mapToPersonOptionElements = (
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
  options.unshift(<option key={0} value="" />);

  return options;
};
