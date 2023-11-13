import MovieModel, {MovieFilter} from "../../models/MovieModel";

export interface MovieStateModel {
    moviesNotLoaded: boolean;
    movieNotLoaded: boolean;
    movieCreated: boolean;
    movieUpdated: boolean;
    filter: MovieFilter;
    movies?: MovieModel[];
    movieListErrorMessages?: string[];
}