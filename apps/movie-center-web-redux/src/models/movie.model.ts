import SelectableModel from './SelectableModel';
import NameEntityModel from './NameEntityModel';
import CastAndCrewModel from './CastAndCrewModel';
import { CoverModel } from './CoverModel';
import { Filter } from './Filter';
import LanguageModel from './LanguageModel';
import { MovieGenreModel } from './MovieGenreModel';

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

export class MovieFilter extends Filter<MovieFilter> {
  static FILTER_DEFAULT_ALL_GENRES: SelectableModel = {
    code: 'ALL',
    name: 'Alla',
  };
  static FILTER_DEFAULT_ALL_FORMATS: SelectableModel = {
    code: 'ALL',
    name: 'Alla',
  };
  static FILTER_DEFAULT_ALL_GRADES = { code: 0, name: 'Alla' };
  static FILTER_SELECTABLE_GRADES = [
    MovieFilter.FILTER_DEFAULT_ALL_GRADES,
    { code: 5, name: '5' },
    { code: 4.5, name: '4,5' },
    { code: 4, name: '4' },
    { code: 3.5, name: '3,5' },
    { code: 3, name: '3' },
    { code: 2.5, name: '2,5' },
    { code: 2, name: '2' },
    { code: 1.5, name: '1,5' },
    { code: 1, name: '1' },
    { code: 0.5, name: '0,5' },
  ];

  title?: string;
  genreCode?: string;
  formatCode?: string;
  grade?: number; // TODO: Ändra till intervall.
  freetext?: string;
}
