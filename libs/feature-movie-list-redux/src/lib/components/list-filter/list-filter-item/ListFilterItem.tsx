import React, { ReactNode } from 'react';

import '../list-filter.component.scss';

interface ListFilterItemProps {
  label: string;
  className?: string;
  headerAdditions?: ReactNode;
  filterBody: ReactNode;
}

export const ListFilterItem = ({
  label,
  className,
  headerAdditions,
  filterBody,
}: ListFilterItemProps) => {
  return (
    <div className={'filter-body-block ' + className}>
      {label && (
        <div className="filter-body-block-title">
          {label} {headerAdditions && headerAdditions}
        </div>
      )}

      <div className="filter-body-block-field">{filterBody}</div>
    </div>
  );
};
