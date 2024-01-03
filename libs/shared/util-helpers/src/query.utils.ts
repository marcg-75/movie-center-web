import { MovieFilter } from '@giron/shared-models';

export const createMovieListQueryString = (
  filter: MovieFilter,
  sortOrder: string,
  sortDir: string,
  page?: number,
  pageSize?: number
): string => {
  let params: Map<string, string> = new Map();
  let qpString = '';

  if (filter) {
    if (filter.title && filter.title !== '') {
      params = params.set('title', filter.title);
    }

    if (
      filter.genreCode &&
      filter.genreCode !== MovieFilter.FILTER_DEFAULT_ALL_GENRES.code
    ) {
      params = params.set('genre', filter.genreCode);
    }

    if (
      filter.formatCode &&
      filter.formatCode !== MovieFilter.FILTER_DEFAULT_ALL_FORMATS.code
    ) {
      params = params.set('format', filter.formatCode);
    }

    if (
      filter.grade &&
      filter.grade !== MovieFilter.FILTER_DEFAULT_ALL_GRADES.code
    ) {
      params = params.set('grade', '' + filter.grade);
    }

    if (filter.freetext && filter.freetext !== '') {
      params = params.set('q', filter.freetext);
    }
  }

  params = addPageParams(params, sortOrder, sortDir, page, pageSize);

  const iter = params.entries();
  let qp = iter.next();
  while (qp && qp.value) {
    const entry = qp.value;
    qpString = `${qpString}${entry[0]}=${entry[1]}&`;
    qp = iter.next();
  }

  return qpString.length
    ? `?${qpString.substring(0, qpString.length - 1)}`
    : '';
};

const addPageParams = (
  params: Map<string, string>,
  sortOrder: string,
  sortDir: string,
  page?: number,
  pageSize?: number
): Map<string, string> => {
  if (page || page === 0) {
    params = params.set('page', '' + page);
  }
  if (pageSize) {
    params = params.set('size', '' + pageSize);
  }
  if (sortOrder && sortDir) {
    params = params.set('sort', sortOrder + ',' + sortDir);
  }
  return params;
};
