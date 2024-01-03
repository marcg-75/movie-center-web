import { MovieFilter } from '@giron/shared-models';

export const DEFAULT_FILTER: MovieFilter = {
  title: '',
  genreCode: MovieFilter.FILTER_DEFAULT_ALL_GENRES.code,
  formatCode: MovieFilter.FILTER_DEFAULT_ALL_FORMATS.code,
  grade: MovieFilter.FILTER_DEFAULT_ALL_GRADES.code,
  freetext: '',
} as MovieFilter;
