import { useFormatsQuery } from './useFormatsQuery';

export const useFormats = () => {
  const { data, isFetching, error } = useFormatsQuery((data) => data);
  return { formats: data, isFormatsLoading: isFetching, error };
};
