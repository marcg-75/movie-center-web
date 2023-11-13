import MovieModel from "../../models/MovieModel";
import PersonRoleModel from "../../models/PersonRoleModel";
import SelectableModel from "../../models/SelectableModel";
import NameEntityModel from "../../models/NameEntityModel";
import LanguageModel from "../../models/LanguageModel";

export interface IMovieProps {
    movie?: {
        movieItem: MovieModel,
        movieNotLoaded: boolean,
        movieCreating: boolean,
        movieUpdating: boolean,
        movieDeleting: boolean,
        movieCreated: boolean,
        movieUpdated: boolean,
        movieErrorMessages: Array<string>
    },
    person?: {
        actors: Array<PersonRoleModel>,
        actorsNotLoaded: boolean,
        actorsErrorMessages: Array<string>,
        crew: Array<PersonRoleModel>,
        crewNotLoaded: boolean,
        crewErrorMessages: Array<string>,
        persons: Array<NameEntityModel>,
        personsNotLoaded: boolean,
        personsErrorMessages: Array<string>
    },
    baseData?: {
        genresLoaded: boolean,
        rolesLoaded: boolean,
        formatsLoaded: boolean,
        studiosLoaded: boolean,
        languagesLoaded: boolean,
        genres: Array<SelectableModel>,
        roles: Array<SelectableModel>,
        formats: Array<SelectableModel>,
        studios: Array<NameEntityModel>,
        languages: Array<LanguageModel>,
        formatsErrorMessage: string,
        languagesErrorMessage: string
    },
    history?: any,
    location?: any,
    testName?: string,
    dispatch?: any
}
