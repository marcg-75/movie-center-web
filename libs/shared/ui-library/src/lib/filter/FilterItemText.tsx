import { ChangeEventHandler } from 'react';

import './filter.component.scss';
import { FilterItem } from './FilterItem';
import debounce from 'lodash/debounce';

type Props = {
  id?: string;
  name: string;
  label?: string;
  helpFilterText?: string;
  placeholder?: string;
  valueUpdated: (value: string) => void;
};

export const FilterItemText = ({
  id,
  name,
  label = 'Fritext',
  helpFilterText,
  placeholder,
  valueUpdated,
}: Props) => {
  const labelAddition = helpFilterText ? (
    <i className="far fa-question-circle" title={helpFilterText}></i>
  ) : undefined;

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    valueUpdated(e.target.value);
  };

  const debouncedOnChange = debounce(onChange, 500);

  return (
    <FilterItem
      id={id}
      label={label}
      labelAddition={labelAddition}
    >
      <div className="filter-freetext-input-wrapper">
        <input
          className="filter-text-input-field"
          type="text"
          placeholder={placeholder}
          name={name}
          onChange={debouncedOnChange}
        />
        <i className="fa fa-search filter-freetext-magnifying-glass"/>
      </div>
    </FilterItem>
  );
};
