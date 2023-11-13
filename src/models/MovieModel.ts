import SelectableModel from './SelectableModel';
import NameEntityModel from "./NameEntityModel";
import CastAndCrewModel from "./CastAndCrewModel";
import {CoverModel} from "./CoverModel";
import {Filter} from './Filter';
import LanguageModel from "./LanguageModel";
import { MovieGenreModel } from './MovieGenreModel';

export default class MovieModel {

    public id: number;
    public title: string;
    public description: string;
    public genres: Array<MovieGenreModel> = [];
    public runtime: string;
    public releaseDate: string;
    //public releaseDate: Moment;
    public country: string;
    public ageRestriction: string;
    public studios: Array<NameEntityModel> = [];

    public actors: Array<CastAndCrewModel> = [];
    public directors: Array<CastAndCrewModel> = [];
    public producers: Array<CastAndCrewModel> = [];
    public music: Array<CastAndCrewModel> = [];
    public writers: Array<CastAndCrewModel> = [];
    public casters: Array<CastAndCrewModel> = [];
    public editors: Array<CastAndCrewModel> = [];
    public cinematography: Array<CastAndCrewModel> = [];
    public sound: Array<CastAndCrewModel> = [];
    public art: Array<CastAndCrewModel> = [];
    public otherRoles: Array<CastAndCrewModel> = [];

    public movieFormatInfo: MovieFormatInfo = new MovieFormatInfo();
    public moviePersonalInfo: MoviePersonalInfo = new MoviePersonalInfo();

    constructor(obj?: any) {
        Object.assign(this, obj);
    }

  //static create(id: number, title: string) {
  //  const movie = new MovieModel();
  //  movie.id = id;
  //  movie.title = title;
  //  return movie;
  //}

    public toString(): string {
        let genres = this.genres ? '' : undefined;
        let studios = this.studios ? '' : undefined;

        if (genres) {
            this.genres.forEach((movieGenre: MovieGenreModel) => genres += `${movieGenre.genre.name}${movieGenre.mainGenre ? '(main genre)' : ''}, `);
        }

        if (studios) {
            this.studios.forEach((studio: NameEntityModel) => studios += `${studio.name}, `);
        }

        return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description},
            Genres: ${genres}
            Runtime: ${this.runtime}, ReleaseDate: ${this.releaseDate}, Country: ${this.country},
            AgeRestriction: ${this.ageRestriction}, Studios: ${studios}`;
    }
}

export class MovieFormatInfo {

    public cover: CoverModel = new CoverModel();
    public format: SelectableModel = new SelectableModel();
    public region: number;
    public upcId: string;
    public discs: number;
    public pictureFormat: string;
    public system: string;
    public audioLanguages: Array<LanguageModel> = [];
    public subtitles: Array<LanguageModel> = [];
}

export class MoviePersonalInfo {

    public archiveNumber: number;
    public grade: number;
    public obtainDate: string;
    public obtainPrice: number;
    public currency: string;
    public obtainPlace: string;
    public notes: string;
}

export class MovieFilter extends Filter<MovieFilter> {

    public static FILTER_DEFAULT_ALL_GENRES: SelectableModel = {'code': 'ALL', 'name': 'Alla'};
    public static FILTER_DEFAULT_ALL_FORMATS: SelectableModel = {'code': 'ALL', 'name': 'Alla'};
    public static FILTER_DEFAULT_ALL_GRADES = {'code': 0, 'name': 'Alla'};
    public static FILTER_SELECTABLE_GRADES = [
        MovieFilter.FILTER_DEFAULT_ALL_GRADES,
        {'code': 5, 'name': '5'},
        {'code': 4.5, 'name': '4,5'},
        {'code': 4, 'name': '4'},
        {'code': 3.5, 'name': '3,5'},
        {'code': 3, 'name': '3'},
        {'code': 2.5, 'name': '2,5'},
        {'code': 2, 'name': '2'},
        {'code': 1.5, 'name': '1,5'},
        {'code': 1, 'name': '1'},
        {'code': 0.5, 'name': '0,5'}
    ];

    public title: string;
    public mainGenreCode: string;
    public formatCode: string;
    public grade: number;  // TODO: Ändra till intervall.
    public freetext: string;
}
