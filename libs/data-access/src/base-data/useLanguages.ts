import { useLanguagesQuery } from './useLanguagesQuery';

export const useLanguages = () => {
  const { data, isFetching, error } = useLanguagesQuery();
  return { languages: data, isLanguagesLoading: isFetching, error };
};
