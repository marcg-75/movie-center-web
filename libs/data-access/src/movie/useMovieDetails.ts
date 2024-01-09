import { useMovieDetailsQuery } from './useMovieDetailsQuery';

export const useMovieDetails = (movieId: number) => {
  const { data, isFetching, error } = useMovieDetailsQuery(
    (data) => data,
    movieId
  );

  return { movie: data, isMovieLoading: isFetching, error };
};
