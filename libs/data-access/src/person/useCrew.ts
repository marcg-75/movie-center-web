import { useCrewQuery } from './useCrewQuery';

export const useCrew = () => {
  const { data, isFetching, error } = useCrewQuery((data) => data);
  return { crew: data, isCrewLoading: isFetching, error };
};
