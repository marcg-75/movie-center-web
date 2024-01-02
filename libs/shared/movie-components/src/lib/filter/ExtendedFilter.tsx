import {
  MovieFilter as MovieModelFilter,
  MovieFilter,
  SelectableModel,
} from '@giron/shared-models';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { FilterItem, Loader } from '@giron/shared-ui-library';

type Props = {
  filter: MovieFilter;
  formats?: SelectableModel[];
  filterChanged: (filter: MovieFilter) => void;
  isLoading?: boolean;
  testName?: string;
};

export const ExtendedFilter = ({
  filter,
  formats,
  filterChanged,
  isLoading = false,
  testName = 'ExtendedFilter_test',
}: Props) => {
  const [filterFormatsToSelect, setFilterFormatsToSelect] = useState([
    MovieModelFilter.FILTER_DEFAULT_ALL_FORMATS,
  ]);
  const [filterGradesToSelect] = useState(
    MovieModelFilter.FILTER_SELECTABLE_GRADES
  );

  useEffect(() => {
    if (
      !filterFormatsToSelect ||
      (filterFormatsToSelect.length < 2 && formats)
    ) {
      const formatsToSelect = Object.assign(
        [],
        formats
      ) as Array<SelectableModel>;
      formatsToSelect.unshift(MovieModelFilter.FILTER_DEFAULT_ALL_GENRES);

      setFilterFormatsToSelect(formatsToSelect);
    }
  }, [filter, formats, isLoading]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const control = e.target;

    const filterCopy: MovieModelFilter = Object.assign(
      {},
      filter
    ) as MovieModelFilter;

    switch (control.name) {
      case 'formatCode':
        filterCopy.formatCode = control.value || undefined;
        break;
      case 'grade':
        filterCopy.grade = control.value
          ? parseInt(control.value, 10)
          : undefined;
        break;
    }

    if (filterChanged) {
      filterChanged(filterCopy);
    }
  };

  const selectableFormatItems: ReactNode[] = filterFormatsToSelect.map(
    (option, i) => {
      return (
        <option key={i} value={option.code}>
          {option.name}
        </option>
      );
    }
  );

  const selectableGradeItems: ReactNode[] = filterGradesToSelect.map(
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
      <FilterItem
        label="Format"
        filterBody={
          <select
            name="formatCode"
            value={filter.formatCode}
            onChange={changeHandler}
          >
            {selectableFormatItems}
          </select>
        }
      />

      <FilterItem
        label="Betyg"
        filterBody={
          <select name="grade" value={filter.grade} onChange={changeHandler}>
            {selectableGradeItems}
          </select>
        }
      />
    </div>
  );
};
