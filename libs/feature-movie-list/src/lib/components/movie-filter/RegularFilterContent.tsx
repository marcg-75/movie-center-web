import { MovieFilter as MovieFilterModel } from '@giron/shared-models';
import { RegularFilter } from '@giron/shared-movie-components';
import { useGenres, useMovieFilter } from '@giron/data-access';

type Props = {
  filterChanged: (filter: MovieFilterModel) => void;
};

export const RegularFilterContent = ({ filterChanged }: Props) => {
  const [filter] = useMovieFilter();
  const { genres, isGenresLoading, error } = useGenres();

  return (
    <RegularFilter
      filter={filter}
      filterChanged={filterChanged}
      genres={genres}
      isLoading={isGenresLoading}
    />
  );
};