import { Filter } from './Filter';
import { SelectableModel } from './SelectableModel';

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
