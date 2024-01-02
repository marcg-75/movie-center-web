import { SelectableModel } from '@giron/shared-models';

export interface MovieGenreModel {
  movieTitle: string;
  genre: SelectableModel;
  mainGenre: boolean;
}
