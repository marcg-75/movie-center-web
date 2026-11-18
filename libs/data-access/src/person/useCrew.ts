import { useCrewQuery } from './useCrewQuery';

export const useCrew = () => {
  const { data, isFetching, error } = useCrewQuery();
  return { crew: data, isCrewLoading: isFetching, error };
};
