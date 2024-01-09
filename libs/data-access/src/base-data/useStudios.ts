import { useStudiosQuery } from './useStudiosQuery';

export const useStudios = () => {
  const { data, isFetching, error } = useStudiosQuery((data) => data);
  return { studios: data, isStudiosLoading: isFetching, error };
};
