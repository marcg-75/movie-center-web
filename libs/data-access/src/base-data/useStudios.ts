import { useStudiosQuery } from './useStudiosQuery';

export const useStudios = () => {
  const { data, isFetching, error } = useStudiosQuery();
  return { studios: data, isStudiosLoading: isFetching, error };
};
