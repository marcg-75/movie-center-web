import { MovieFilter as MovieFilterModel } from '@giron/shared-models';
import { useFormats, useMovieFilter } from '@giron/data-access';
import { ExtendedFilter } from '@giron/shared-movie-components';

type Props = {
  filterChanged: (filter: MovieFilterModel) => void;
};

export const ExtendedFilterContent = ({ filterChanged }: Props) => {
  const [filter] = useMovieFilter();
  const { formats, isFormatsLoading, error } = useFormats();

  return (
    <ExtendedFilter
      filter={filter}
      filterChanged={filterChanged}
      formats={formats}
      isLoading={isFormatsLoading}
    />
  );
};