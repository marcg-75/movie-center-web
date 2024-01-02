import {
  MovieFilter as MovieModelFilter,
  MovieFilter,
  SelectableModel,
} from '@giron/shared-models';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { FilterItem, FilterItemText, Loader } from '@giron/shared-ui-library';

const helpFilterFreetext =
  'Du kan välja att filtrera på filmens titel, genre eller annat. Tryck sedan på ' +
  'Enter eller på förstoringsglaset för att se resultat.';

type Props = {
  filter: MovieFilter;
  genres?: SelectableModel[];
  filterChanged: (filter: MovieFilter) => void;
  isLoading?: boolean;
  testName?: string;
};
export const RegularFilter = ({
  filter,
  genres,
  filterChanged,
  isLoading = false,
  testName = 'RegularFilter_test',
}: Props) => {
  const [filterGenresToSelect, setFilterGenresToSelect] = useState([
    MovieFilter.FILTER_DEFAULT_ALL_GENRES,
  ]);

  useEffect(() => {
    if (!filterGenresToSelect || (filterGenresToSelect.length < 2 && genres)) {
      const genresToSelect = Object.assign([], genres) as SelectableModel[];
      genresToSelect.unshift(MovieFilter.FILTER_DEFAULT_ALL_GENRES);

      setFilterGenresToSelect(genresToSelect);
    }
  }, [filter, genres, isLoading]);

  const genreChangeHandler = (e: ChangeEvent<HTMLSelectElement>): void => {
    const filterCopy: MovieModelFilter = Object.assign(
      {},
      filter
    ) as MovieModelFilter;

    filterCopy.genreCode = e.target.value || undefined;

    if (filterChanged) {
      filterChanged(filterCopy);
    }
  };

  const textValueChangeHandler = (value: string, controlName: string): void => {
    const filterCopy: MovieModelFilter = Object.assign(
      {},
      filter
    ) as MovieModelFilter;

    switch (controlName) {
      case 'title':
        filterCopy.title = value || undefined;
        break;
      case 'freetext':
        filterCopy.freetext = value || undefined;
        break;
    }

    if (filterChanged) {
      filterChanged(filterCopy);
    }
  };

  const selectableGenreItems: ReactNode[] = filterGenresToSelect.map(
    (option, i) => {
      return (
        <option key={i} value={option.code}>
          {option.name}
        </option>
      );
    }
  );

  return isLoading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <div data-test-name={testName}>
      <FilterItemText
        name="title"
        label="Titel"
        placeholder="Sök på filmtitel..."
        valueUpdated={(value) => textValueChangeHandler(value, 'title')}
      />

      <FilterItem
        label="Genre"
        filterBody={
          <select
            name="genreCode"
            value={filter.genreCode}
            onChange={genreChangeHandler}
          >
            {selectableGenreItems}
          </select>
        }
      />

      <FilterItemText
        name="freetext"
        helpFilterText={helpFilterFreetext}
        placeholder="Filtrera på övriga fält..."
        valueUpdated={(value) => textValueChangeHandler(value, 'freetext')}
      />
    </div>
  );
};
