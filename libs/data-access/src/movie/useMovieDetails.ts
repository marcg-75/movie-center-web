import { IMovie } from '@giron/shared-models';
import { useMovieDetailsQuery } from './useMovieDetailsQuery';

export const useMovieDetails = (movieId: number) => {
  const { data, isFetching, error } = useMovieDetailsQuery<IMovie>((data) => data, movieId);

  return { movie: data, isMovieLoading: isFetching, error };
};
