import { useLanguagesQuery } from './useLanguagesQuery';

export const useLanguages = () => {
  const { data, isFetching, error } = useLanguagesQuery((data) => data);
  return { languages: data, isLanguagesLoading: isFetching, error };
};
