import { SelectableModel } from './index';

export interface MovieGenreModel {
  movieTitle: string;
  genre: SelectableModel;
  mainGenre: boolean;
}
