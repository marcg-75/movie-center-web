import { ListFilterItem } from '../list-filter/list-filter-item/ListFilterItem';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { BaseDataStateModel, loadFormats, MovieListStateModel, SelectableModel } from '@giron/data-access-redux';
import { Loader } from '@giron/shared-ui-library';
import { connect } from 'react-redux';
import { MovieFilter as MovieModelFilter } from '../../models/MovieFilter';

interface ExtendedFilterContentProps {
  filter: MovieModelFilter;
  baseData: BaseDataStateModel;
  filterChanged: (filter: MovieModelFilter) => void;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const ExtendedFilterContent = ({
  filter,
  baseData,
  filterChanged,
  dispatch,
  testName = 'ExtendedFilterContent_test',
}: ExtendedFilterContentProps) => {
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterFormatsToSelect, setFilterFormatsToSelect] = useState([
    MovieModelFilter.FILTER_DEFAULT_ALL_FORMATS,
  ]);
  const [filterGradesToSelect] = useState(
    MovieModelFilter.FILTER_SELECTABLE_GRADES
  );

  useEffect(() => {
    dispatch(loadFormats());
  }, []);

  useEffect(() => {
    if (
      !filterFormatsToSelect ||
      (filterFormatsToSelect.length < 2 && baseData?.formats)
    ) {
      const formatsToSelect = Object.assign(
        [],
        baseData.formats
      ) as Array<SelectableModel>;
      formatsToSelect.unshift(MovieModelFilter.FILTER_DEFAULT_ALL_GENRES);

      setFilterFormatsToSelect(formatsToSelect);
    }

    setFilterLoading(!filter || !baseData?.formatsLoaded);
  }, [filter, baseData]);

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

  const filterFormatItemsToSelect: ReactNode[] = filterFormatsToSelect.map(
    (option, i) => {
      return (
        <option key={i} value={option.code}>
          {option.name}
        </option>
      );
    }
  );

  const filterGradeItemsToSelect: ReactNode[] = filterGradesToSelect.map(
    (option, i) => {
      return (
        <option key={i} value={option.code}>
          {option.name}
        </option>
      );
    }
  );

  return filterLoading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <div data-test-name={testName}>
      <ListFilterItem
        label="Format"
        filterBody={
          <select
            name="formatCode"
            value={filter.formatCode}
            onChange={changeHandler}
          >
            {filterFormatItemsToSelect}
          </select>
        }
      />

      <ListFilterItem
        label="Betyg"
        filterBody={
          <select name="grade" value={filter.grade} onChange={changeHandler}>
            {filterGradeItemsToSelect}
          </select>
        }
      />
    </div>
  );
};

function stateToProps({
  baseData,
  movieList: { filter },
}: {
  baseData: BaseDataStateModel;
  movieList: MovieListStateModel;
}) {
  return {
    baseData,
    filter,
  };
}

export default connect(stateToProps)(ExtendedFilterContent);
