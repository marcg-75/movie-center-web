import { CastAndCrewModel } from './CastAndCrewModel';
import { CoverModel } from './CoverModel';
import { LanguageModel } from './LanguageModel';
import { MovieGenreModel } from './MovieGenreModel';
import { NameEntityModel, SelectableModel } from './index';

export interface IMovie {
  id?: number;
  title: string;
  originalTitle?: string;
  description: string;
  genres: MovieGenreModel[];
  runtime?: string;
  releaseDate?: string;
  country: string;
  ageRestriction: string;
  imdbId?: string;
  studios: NameEntityModel[];

  actors: CastAndCrewModel[];
  directors: CastAndCrewModel[];
  producers: CastAndCrewModel[];
  music: CastAndCrewModel[];
  writers: CastAndCrewModel[];
  casters: CastAndCrewModel[];
  editors: CastAndCrewModel[];
  cinematography: CastAndCrewModel[];
  sound: CastAndCrewModel[];
  art: CastAndCrewModel[];
  otherRoles: CastAndCrewModel[];

  movieFormatInfo: MovieFormatInfo;
  moviePersonalInfo: MoviePersonalInfo;
}

export const movieToString = (movie: IMovie): string => {
  let genres = movie.genres ? '' : undefined;
  let studios = movie.studios ? '' : undefined;

  if (genres) {
    movie.genres.forEach(
      (movieGenre: MovieGenreModel) =>
        (genres += `${movieGenre.genre.name}${
          movieGenre.mainGenre ? '(main genre)' : ''
        }, `)
    );
  }

  if (studios) {
    movie.studios.forEach(
      (studio: NameEntityModel) => (studios += `${studio.name}, `)
    );
  }

  return `ID: ${movie.id}, Title: ${movie.title}, Description: ${movie.description},
        Genres: ${genres}
        Runtime: ${movie.runtime}, ReleaseDate: ${movie.releaseDate}, Country: ${movie.country},
        AgeRestriction: ${movie.ageRestriction}, Studios: ${studios}`;
};

export interface MovieFormatInfo {
  cover: CoverModel;
  format: SelectableModel;
  region: number;
  upcId: string;
  discs: number;
  pictureFormat: string;
  system: string;
  audioLanguages: LanguageModel[];
  subtitles: LanguageModel[];
}

export interface MoviePersonalInfo {
  archiveNumber?: number;
  grade?: number;
  obtainDate?: string;
  obtainPrice?: number;
  currency?: string;
  obtainPlace?: string;
  notes?: string;
}
