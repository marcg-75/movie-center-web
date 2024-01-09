import { useRolesQuery } from './useRolesQuery';

export const useRoles = () => {
  const { data, isFetching, error } = useRolesQuery((data) => data);
  return { roles: data, isRolesLoading: isFetching, error };
};
