import { useMovieListQuery } from './useMovieListQuery';

export const useMovieList = (
  sortOrder = 'title',
  sortDir = 'asc',
  page = 0,
  pageSize?: number
) => {
  const { data, isFetching, error  } = useMovieListQuery(
    (data) => data,
    sortOrder,
    sortDir,
    page,
    pageSize
  );
  return { movies: data?.content, isMoviesLoading: isFetching, error };
};
