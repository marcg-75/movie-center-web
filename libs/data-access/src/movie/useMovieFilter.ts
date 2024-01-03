import { atom, useAtom } from 'jotai';
import { DEFAULT_FILTER } from './constants';

const filterAtom = atom(DEFAULT_FILTER);

export const useMovieFilter = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  const resetFilter = () => setFilter(DEFAULT_FILTER);

  return [
    filter,
    setFilter,
    resetFilter,
  ] as const;
};
