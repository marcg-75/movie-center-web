import { useGenresQuery } from './useGenresQuery';

export const useGenres = () => {
  const { data, isFetching, error  } = useGenresQuery((data) => data);
  return { genres: data, isGenresLoading: isFetching, error };
};
