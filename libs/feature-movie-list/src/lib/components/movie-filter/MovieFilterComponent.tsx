import { MovieFilter as MovieFilterModel } from '@giron/shared-models';
import { ListFilter } from '@giron/shared-movie-components';
import { RegularFilterContent } from './RegularFilterContent';
import { ExtendedFilterContent } from './ExtendedFilterContent';
import { useMovieFilter } from '@giron/data-access';

const helpFilter =
  'Du kan filtrera fram de filmer som du är intresserad i genom att välja kriteria ' +
  'eller skriva valfri text. Du kan återställa filtret genom att trycka på länken ' +
  '"Rensa filtrering", varefter alla filmer kommer att visas.';

type Props = {
  testName?: string;
};

export const MovieFilterComponent = ({
  testName = 'MovieFilterComponent_test',
}: Props) => {
  const { setFilter, resetFilter } = useMovieFilter();

  const filterChanged = (filter: MovieFilterModel) => {
    setFilter(filter);
  };

  const clearFilter = () => {
    resetFilter();
  };

  return (
    <div data-test-name={testName}>
      <ListFilter
        header="Filtrering av filmer"
        helpText={helpFilter}
        clearFilter={clearFilter}
        enableSaveFilter={
          process.env.NEXT_PUBLIC_ENABLE_SAVE_MOVIE_FILTER === 'true'
        }
        compactModeActions={true}
        regularContent={<RegularFilterContent filterChanged={filterChanged} />}
        extendedContent={
          <ExtendedFilterContent filterChanged={filterChanged} />
        }
      />
    </div>
  );
};
