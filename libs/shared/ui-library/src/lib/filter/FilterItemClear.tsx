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
      <p className="text-[#007d7a] text-label-medium font-bold whitespace-nowrap mt-2.5 filter-action-text">
        <i className="fas fa-eraser pr-1.5 pl-2.5" />
        Töm filter
      </p>
    </button>
  );

  return (
    <div>
      {!compactMode && <FilterItem label="&nbsp;">{filterItemBody}</FilterItem>}

      {compactMode && <div className="filter-clear">{filterItemBody}</div>}
    </div>
  );
};
