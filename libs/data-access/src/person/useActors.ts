import { useActorsQuery } from './useActorsQuery';

export const useActors = () => {
  const { data, isFetching, error } = useActorsQuery();
  return { actors: data, isActorsLoading: isFetching, error };
};
