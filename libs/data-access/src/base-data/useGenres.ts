import { useGenresQuery } from './useGenresQuery';

export const useGenres = () => {
  const { data, isFetching, error } = useGenresQuery();
  return { genres: data, isGenresLoading: isFetching, error };
};
