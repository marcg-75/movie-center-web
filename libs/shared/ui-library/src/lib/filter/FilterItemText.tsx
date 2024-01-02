import { ReactNode } from 'react';

import './filter.component.scss';
import { FilterItem } from './FilterItem';

interface TextListFilterItemProps {
  label?: string;
  helpFilterText?: string;
  filterBody: ReactNode;
}

export const FilterItemText = ({
  label = 'Fritext',
  helpFilterText,
  filterBody,
}: TextListFilterItemProps) => {
  const headerAdditions = helpFilterText ? (
    <i className="far fa-question-circle" title={helpFilterText}></i>
  ) : undefined;

  const filterItemBody = (
    <div className="filter-freetext-input-wrapper">{filterBody}</div>
  );

  return (
    <FilterItem
      label={label}
      className="filter-body-block-freetext"
      headerAdditions={headerAdditions}
      filterBody={filterItemBody}
    />
  );
};
