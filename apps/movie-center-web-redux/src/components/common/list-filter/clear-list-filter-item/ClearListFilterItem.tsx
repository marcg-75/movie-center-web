import React from 'react';

import '../list-filter.component.scss';
import { ListFilterItem } from '../list-filter-item/ListFilterItem';

interface ClearListFilterItemProps {
  clearFilter: () => void;
  compactMode: boolean;
}

export const ClearListFilterItem = ({
  clearFilter,
  compactMode,
}: ClearListFilterItemProps) => {
  const clear = () => {
    if (window.confirm('Vill du nollställa filtret?')) {
      clearFilter();
    }
  };

  const filterItemBody = (
    <button onClick={() => clear()}>
      <p className="filter-action-text">
        <i className="fas fa-eraser filter-action-icon" />
        Rensa filtrering
      </p>
    </button>
  );

  return (
    <div>
      {!compactMode && (
        <ListFilterItem
          label="&nbsp;"
          className="filter-clear"
          filterBody={filterItemBody}
        />
      )}

      {compactMode && <div className="filter-clear">{filterItemBody}</div>}
    </div>
  );
};
