import { useAllPersonsQuery } from './useAllPersonsQuery';

export const useAllPersons = (enabled: boolean) => {
  const { data, isFetching, error } = useAllPersonsQuery(enabled);
  return { persons: data, isPersonsLoading: isFetching, error };
};
