import './filter.component.scss';
import { FilterItem } from './FilterItem';

type Props = {
  clearFilter: () => void;
  compactMode: boolean;
};

export const FilterItemClear = ({ clearFilter, compactMode }: Props) => {
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
        <FilterItem
          label="&nbsp;"
          className="filter-clear"
          filterBody={filterItemBody}
        />
      )}

      {compactMode && <div className="filter-clear">{filterItemBody}</div>}
    </div>
  );
};
