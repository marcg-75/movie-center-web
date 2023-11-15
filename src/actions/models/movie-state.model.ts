import MovieModel, {MovieFilter} from "../../models/MovieModel";

export interface MovieStateModel {
    filter: MovieFilter;
    movies?: MovieModel[];
    movieItem?: MovieModel;
    movieListErrorMessages?: string[];
    movieErrorMessages?: Array<string>;
    moviesNotLoaded: boolean;
    movieNotLoaded: boolean;
    movieCreated: boolean;
    movieUpdated: boolean;
    movieCreating: boolean;
    movieUpdating: boolean;
    movieDeleting: boolean;
}
