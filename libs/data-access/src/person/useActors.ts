import { useActorsQuery } from './useActorsQuery';

export const useActors = () => {
  const { data, isFetching, error } = useActorsQuery((data) => data);
  return { actors: data, isActorsLoading: isFetching, error };
};
