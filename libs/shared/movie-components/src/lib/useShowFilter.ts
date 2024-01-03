import { atom, useAtom } from 'jotai';

const showFilterAtom = atom(true);

export const useShowFilter = () => {
  const [showFilter, setShowFilter] = useAtom(showFilterAtom);

  return [
    showFilter,
    setShowFilter,
  ] as const;
};
