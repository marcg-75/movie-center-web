import {
  MovieFilter as MovieModelFilter,
  MovieFilter,
  SelectableModel,
} from '@giron/shared-models';
import { useEffect, useState } from 'react';
import { FilterItem, FilterItemText, Loader } from '@giron/shared-ui-library';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {
  mapMultipleSelectionToText,
  SelectMenuProps,
} from '@giron/shared-util-helpers';

const helpFilterFreetext =
  'Du kan välja att filtrera på filmens titel, genre eller annat. Tryck sedan på ' +
  'Enter eller på förstoringsglaset för att se resultat.';

type Props = {
  filter: MovieFilter;
  genres?: SelectableModel[];
  filterChanged: (filter: MovieFilter) => void;
  isLoading?: boolean;
};
export const RegularFilter = ({
  filter,
  genres,
  filterChanged,
  isLoading = false,
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

  const genreChangeHandler = (event: SelectChangeEvent): void => {
    const filterCopy: MovieModelFilter = Object.assign(
      {},
      filter
    ) as MovieModelFilter;

    filterCopy.genreCode = event.target.value || undefined;

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

  return isLoading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <>
      <FilterItemText
        id="title-filter"
        name="title"
        label="Titel"
        placeholder="Sök på filmtitel..."
        valueUpdated={(value) => textValueChangeHandler(value, 'title')}
      />

      <FilterItem id="genre-filter" label="Genre">
        <Select
          className="bg-white filter-select"
          value={filter.genreCode}
          onChange={genreChangeHandler}
          renderValue={(selected) =>
            mapMultipleSelectionToText(selected, filterGenresToSelect)
          }
          MenuProps={SelectMenuProps}
          slotProps={{
            input: {
              className: 'text-body-medium py-2 pr-8 pl-2',
            },
          }}
        >
          {filterGenresToSelect?.map((option, index) => (
            <MenuItem key={index} value={option.code}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FilterItem>

      <FilterItemText
        id="freetext-filter"
        name="freetext"
        helpFilterText={helpFilterFreetext}
        placeholder="Filtrera på övriga fält..."
        valueUpdated={(value) => textValueChangeHandler(value, 'freetext')}
      />
    </>
  );
};
