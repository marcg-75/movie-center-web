import { CastAndCrewModel } from '../../../data-access-redux/src/models/CastAndCrewModel';
import { CoverModel } from '../../../data-access-redux/src/models/CoverModel';
import { LanguageModel } from '../../../data-access-redux/src/models/LanguageModel';
import { MovieGenreModel } from '../../../data-access-redux/src/models/MovieGenreModel';
import { NameEntityModel, SelectableModel } from './index';

export interface IMovie {
  id?: number;
  title: string;
  originalTitle?: string;
  description: string;
  genres: Array<MovieGenreModel>;
  runtime?: string;
  releaseDate?: string;
  country: string;
  ageRestriction: string;
  imdbId?: string;
  studios: Array<NameEntityModel>;

  actors: Array<CastAndCrewModel>;
  directors: Array<CastAndCrewModel>;
  producers: Array<CastAndCrewModel>;
  music: Array<CastAndCrewModel>;
  writers: Array<CastAndCrewModel>;
  casters: Array<CastAndCrewModel>;
  editors: Array<CastAndCrewModel>;
  cinematography: Array<CastAndCrewModel>;
  sound: Array<CastAndCrewModel>;
  art: Array<CastAndCrewModel>;
  otherRoles: Array<CastAndCrewModel>;

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
  audioLanguages: Array<LanguageModel>;
  subtitles: Array<LanguageModel>;
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
