import { useAllPersonsQuery } from './useAllPersonsQuery';

export const useAllPersons = (enabled: boolean) => {
  const { data, isFetching, error } = useAllPersonsQuery(
    (data) => data,
    enabled
  );
  return { persons: data, isPersonsLoading: isFetching, error };
};
