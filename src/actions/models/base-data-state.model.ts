import SelectableModel from '../../models/SelectableModel';
import NameEntityModel from '../../models/NameEntityModel';
import LanguageModel from '../../models/LanguageModel';

export interface BaseDataStateModel {
    genresLoaded: boolean;
    rolesLoaded: boolean;
    formatsLoaded: boolean;
    studiosLoaded: boolean;
    languagesLoaded: boolean;
    genres: Array<SelectableModel>;
    roles: Array<SelectableModel>;
    formats: Array<SelectableModel>;
    studios: Array<NameEntityModel>;
    languages: Array<LanguageModel>;
    formatsErrorMessage: string;
    languagesErrorMessage: string;
}
