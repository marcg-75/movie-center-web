import { useRolesQuery } from './useRolesQuery';

export const useRoles = () => {
  const { data, isFetching, error } = useRolesQuery();
  return { roles: data, isRolesLoading: isFetching, error };
};
