import { atom, useAtom } from 'jotai';

const showExtendedFilterAtom = atom(false);

export const useShowExtendedFilter = () => {
  const [showExtendedFilter, setShowExtendedFilter] = useAtom(
    showExtendedFilterAtom
  );

  return [showExtendedFilter, setShowExtendedFilter] as const;
};
