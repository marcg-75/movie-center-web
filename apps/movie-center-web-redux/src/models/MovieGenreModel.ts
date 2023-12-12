import SelectableModel from './SelectableModel';

export interface MovieGenreModel {
    movieTitle: string;
    genre: SelectableModel;
    mainGenre: boolean;
}
