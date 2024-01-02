import { ReactNode } from 'react';

import './filter.component.scss';

type Props = {
  label: string;
  className?: string;
  headerAdditions?: ReactNode;
  filterBody: ReactNode;
}

export const FilterItem = ({
  label,
  className,
  headerAdditions,
  filterBody,
}: Props) => {
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
